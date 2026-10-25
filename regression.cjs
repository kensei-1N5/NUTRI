const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const prefix=source.slice(0,source.indexOf('function toast('));
const ctx=vm.createContext({crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,Array,Number,String,Set,Date,Intl,btoa,atob,console});
vm.runInContext(prefix,ctx);
const run=(expr)=>vm.runInContext(expr,ctx);
const stores=run('STORES');
function backup(){const data={app:'NUTRI',version:3,stores:{}};for(const s of stores)data.stores[s]=[];return data;}
let passed=0;
async function test(name,fn){await fn();passed++;console.log('OK',name)}
(async()=>{
await test('calories et macros pour 150 g',()=>{const t=run('totals([{grams:150,kcal:120,protein:8,carbs:10,fat:4}])');assert.equal(t.kcal,180);assert.equal(t.protein,12);assert.equal(t.carbs,15);assert.equal(t.fat,6)});
await test('aucun apport sur journal vide',()=>assert.equal(run('totals([]).kcal'),0));
await test('sauvegarde vide valide',()=>{ctx.sample=backup();run('validate(sample)')});
await test('identifiants dupliqués rejetés',()=>{const d=backup();d.stores.foods=[{id:'a',name:'A'},{id:'a',name:'B'}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/dupliqué/)});
await test('calories négatives rejetées',()=>{const d=backup();d.stores.foods=[{id:'a',name:'A',kcal:-2}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/nutritionnelles/)});
await test('données manquantes rejetées',()=>{const d=backup();delete d.stores.entries;ctx.sample=d;assert.throws(()=>run('validate(sample)'),/incompatible/)});
await test('chiffrement et déchiffrement',async()=>{ctx.sample=backup();const encrypted=await run("seal(sample,'mot-de-passe-long')");ctx.encrypted=JSON.parse(encrypted);const restored=await run("unseal(encrypted,'mot-de-passe-long')");assert.equal(restored.app,'NUTRI');assert.equal(restored.version,3)});
await test('mot de passe erroné rejeté',async()=>{await assert.rejects(run("unseal(encrypted,'mauvais')"))});
await test('fichier altéré rejeté',async()=>{const damaged={...ctx.encrypted,data:ctx.encrypted.data.slice(0,-4)+'AAAA'};ctx.damaged=damaged;await assert.rejects(run("unseal(damaged,'mot-de-passe-long')"))});
await test('entrée sans date rejetée',()=>{const d=backup();d.stores.entries=[{id:'a',name:'Riz',grams:100,kcal:120}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/journal/)});
await test('hydratation négative rejetée',()=>{const d=backup();d.stores.water=[{id:'a',ml:-250}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/Hydratation/)});
await test('poids impossible rejeté',()=>{const d=backup();d.stores.weights=[{id:'a',kg:0}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/Poids/)});
await test('activité avec durée négative rejetée',()=>{const d=backup();d.stores.activities=[{id:'a',minutes:-5}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/Activité/)});
await test('recette aux ingrédients invalides rejetée',()=>{const d=backup();d.stores.recipes=[{id:'a',ingredients:'erreur'}];ctx.sample=d;assert.throws(()=>run('validate(sample)'),/Ingrédients/)});
await test('ancienne sauvegarde sans collections récentes migrée',()=>{const d=backup();d.version=1;delete d.stores.fasting;delete d.stores.plans;delete d.stores.activities;delete d.stores.recipes;ctx.sample=d;run('validate(sample)');assert.equal(d.stores.recipes.length,0);assert.equal(d.stores.activities.length,0)});
console.log(`${passed} tests réussis`)
})().catch(e=>{console.error(e);process.exitCode=1});
