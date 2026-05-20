import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

/* ==========================================
   1. ANIMAÇÕES GSAP (Modo Blindado)
   ========================================== */
gsap.registerPlugin(ScrollTrigger);

// O código começa animando a opacidade de 0 PARA 1 (Em vez de esconder no CSS)
gsap.from(".profile-container", { duration: 1.2, opacity: 0, scale: 0.5, ease: "back.out(1.5)" });
gsap.from(".reveal", { opacity: 0, y: 30, duration: 0.8, stagger: 0.2, delay: 0.5 });

gsap.utils.toArray(".reveal-up").forEach(el => {
    gsap.from(el, { scrollTrigger: { trigger: el, start: "top 85%" }, opacity: 0, y: 50, duration: 1, ease: "power2.out" });
});

gsap.from(".reveal-left", { scrollTrigger: ".timeline", opacity: 0, x: -50, duration: 1, stagger: 0.3 });
gsap.from(".reveal-right", { scrollTrigger: ".timeline", opacity: 0, x: 50, duration: 1, stagger: 0.3 });

/* ==========================================
   2. ANIMAÇÃO 3D NO BACKGROUND (THREE.JS)
   ========================================== */
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.15 });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.003;
    torusKnot.rotation.y += 0.003;
    torusKnot.rotation.z += 0.001;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ==========================================
   3. INTEGRAÇÃO COM SUPABASE (Corrigida)
   ========================================== */
// URL correta (sem o /rest/v1/)
const supabaseUrl = 'https://ytyqxtmihnejpfljyyam.supabase.co';
const supabaseKey = 'sb_publishable_h0ACKlGV7zZeEz2bo0FirA_GCr0SdZ9';
const supabase = createClient(supabaseUrl, supabaseKey);

const formContato = document.getElementById('form-contato');
const btnEnviar = document.getElementById('btn-enviar');

formContato.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    btnEnviar.innerText = 'Enviando...';
    btnEnviar.disabled = true;

    try {
        const { error } = await supabase
            .from('mensagens_portfolio')
            .insert([{ nome, email, mensagem }]);

        if (error) throw error;

        alert('Mensagem enviada com sucesso!');
        formContato.reset();
    } catch (error) {
        console.error('Erro:', error.message);
        alert('Erro ao enviar. Verifique o console.');
    } finally {
        btnEnviar.innerText = 'Enviar Mensagem';
        btnEnviar.disabled = false;
    }
});

/* ==========================================
   4. MENU HAMBÚRGUER (MOBILE)
   ========================================== */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => navLinks.classList.toggle("active"));
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
});