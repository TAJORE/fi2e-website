#!/usr/bin/env node
/* =========================================================
   FI2E — Injection des blocs partagés dans les pages HTML
   =========================================================

   Les blocs communs à toutes les pages (fin du <head>, menu,
   pied de page, scripts) vivent dans partials/. Ce script les
   réinjecte dans chaque *.html à la racine.

     node build.js          met les pages à jour
     node build.js --check  vérifie sans écrire (code 1 si désync)

   À lancer après CHAQUE modification d'un fichier partials/.

   Au premier passage, le script retrouve les blocs existants
   par leur structure, puis les encadre de marqueurs
   <!-- @partial:nom --> … <!-- @/partial:nom --> qu'il réutilise
   ensuite. Tout ce qui est HORS de ces marqueurs (le contenu
   propre à chaque page, son <title>, sa meta description) n'est
   jamais touché.
   ========================================================= */

const fs = require('fs');
const path = require('path');

const root = __dirname;
const partialsDir = path.join(root, 'partials');
const check = process.argv.includes('--check');

/* Quelle entrée de menu porte la classe "active" sur quelle page.
   projets.html surligne son parent Réalisations. */
const ACTIVE = {
  'index.html': 'index',
  'entreprise.html': 'entreprise',
  'services.html': 'services',
  'expertises.html': 'expertises',
  'realisations.html': 'realisations',
  'projets.html': 'realisations',
  'partenaires.html': 'partenaires',
  'carrieres.html': 'carrieres',
  'blog.html': 'blog',
  'contact.html': 'contact',
};

const NAMES = ['head', 'nav', 'footer', 'scripts'];

/* Comment retrouver chaque bloc lors du tout premier passage,
   avant que les marqueurs n'existent. */
const LEGACY = {
  head: /(?<=<meta name="description"[^>]*>)[\s\S]*?(?=<\/head>)/,
  nav: /(?:<!-- =+ NAV =+ -->\s*)?<header>[\s\S]*?<\/header>/,
  footer: /<footer[\s\S]*?<\/footer>\s*<button id="back-to-top"[\s\S]*?<\/button>/,
  scripts: /<script src="https:\/\/unpkg\.com\/aos@[\s\S]*?<script src="assets\/js\/main\.js"><\/script>/,
};

/* Le bloc head est inséré au milieu du <head>, il lui faut ses
   propres sauts de ligne ; les autres remplacent un bloc déjà
   isolé par des lignes vides. */
const LEGACY_WRAP = {
  head: s => '\n' + s + '\n',
  nav: s => s,
  footer: s => s,
  scripts: s => s,
};

const partials = {};
for (const name of NAMES) {
  partials[name] = fs
    .readFileSync(path.join(partialsDir, name + '.html'), 'utf8')
    .replace(/^﻿/, '')
    .replace(/\s+$/, '');
}

const markerRe = name =>
  new RegExp(`<!-- @partial:${name} -->[\\s\\S]*?<!-- @/partial:${name} -->`);

/* Pose la classe "active" sur la bonne entrée du menu. */
function applyActive(navHtml, key) {
  if (!key) return navHtml;
  const re = new RegExp(`(data-nav="${key}" class="nav-link)`);
  if (!re.test(navHtml)) {
    throw new Error(`partials/nav.html : aucun lien data-nav="${key}"`);
  }
  return navHtml.replace(re, '$1 active');
}

function block(name, page) {
  const body = name === 'nav' ? applyActive(partials.nav, ACTIVE[page]) : partials[name];
  return `<!-- @partial:${name} -->\n${body}\n<!-- @/partial:${name} -->`;
}

const files = fs.readdirSync(root).filter(f => f.endsWith('.html')).sort();

let changed = 0;
let failed = 0;
let seeded = false;

for (const file of files) {
  if (!(file in ACTIVE)) {
    console.log(`  ${file.padEnd(20)} ignorée (absente de la table ACTIVE)`);
    continue;
  }

  const fp = path.join(root, file);
  const before = fs.readFileSync(fp, 'utf8');
  let src = before;
  const applied = [];
  const missing = [];

  for (const name of NAMES) {
    const rendered = block(name, file);
    const mre = markerRe(name);
    if (mre.test(src)) {
      src = src.replace(mre, () => rendered);
      applied.push(name);
    } else if (LEGACY[name].test(src)) {
      src = src.replace(LEGACY[name], () => LEGACY_WRAP[name](rendered));
      applied.push(name + '*');
      seeded = true;
    } else {
      missing.push(name);
    }
  }

  if (missing.length) {
    console.error(`  ${file.padEnd(20)} ERREUR — bloc introuvable : ${missing.join(', ')} — fichier laissé intact`);
    failed++;
    continue;
  }

  if (src === before) {
    console.log(`  ${file.padEnd(20)} à jour`);
    continue;
  }

  changed++;
  if (check) {
    console.error(`  ${file.padEnd(20)} DÉSYNCHRONISÉE (${applied.join(', ')})`);
  } else {
    fs.writeFileSync(fp, src, 'utf8');
    console.log(`  ${file.padEnd(20)} mise à jour (${applied.join(', ')})`);
  }
}

console.log(
  check
    ? `\n${changed} page(s) désynchronisée(s), ${failed} en erreur.`
    : `\n${changed} page(s) mise(s) à jour, ${failed} en erreur.`
);
if (seeded) console.log('(* = bloc retrouvé par structure, marqueurs posés)');

if (failed || (check && changed)) process.exit(1);
