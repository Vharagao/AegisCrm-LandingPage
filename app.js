// --- 1. ELEMENTOS VIVOS: HOLOFOTE DO CURSOR (MOUSE SPOTLIGHT) ---
const spotlight = document.getElementById('spotlight');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  // Atualiza as variáveis de CSS no spotlight
  spotlight.style.setProperty('--mouse-x', `${x}px`);
  spotlight.style.setProperty('--mouse-y', `${y}px`);
});


// --- 2. REVELAÇÃO SUAVE NO SCROLL (SCROLL REVEAL) ---
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Uma vez revelado, não precisa reavaliar
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12, // Revela quando 12% do elemento estiver visível
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
  revealOnScroll.observe(element);
});


// --- 3. BOTOES MAGNÉTICOS (MAGNETIC BUTTONS) ---
const magneticTargets = document.querySelectorAll('.magnetic-target');

magneticTargets.forEach(target => {
  target.addEventListener('mousemove', (e) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Move o botão ligeiramente na direção do mouse
    target.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.02)`;
    target.style.transition = 'none'; // Sem delay durante o movimento
  });
  
  target.addEventListener('mouseleave', () => {
    // Retorna o botão à posição original de forma suave
    target.style.transform = 'translate(0px, 0px) scale(1)';
    target.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});


// --- 4. PIPELINE VIVO (DRAG AND DROP INTERATIVO) ---
let draggedCard = null;

function drag(ev) {
  draggedCard = ev.target;
  ev.target.classList.add('moving');
  ev.dataTransfer.setData("text", ev.target.id);
}

document.addEventListener("dragend", (ev) => {
  if (draggedCard) {
    draggedCard.classList.remove('moving');
  }
});

function allowDrop(ev) {
  ev.preventDefault();
  const column = ev.currentTarget;
  column.classList.add('dragover');
}

function dragLeave(ev) {
  const column = ev.currentTarget;
  column.classList.remove('dragover');
}

function drop(ev, colId) {
  ev.preventDefault();
  const column = document.getElementById(colId);
  column.classList.remove('dragover');
  
  if (draggedCard) {
    column.appendChild(draggedCard);
    atualizarContadores();
    
    // Se o lead foi ganho (col-won), dispara um feedback visual de comemoração
    if (colId === 'col-won') {
      triggerWonCelebration(draggedCard);
    }
  }
}

function atualizarContadores() {
  const colNew = document.getElementById('col-new').querySelectorAll('.lead-card').length;
  const colNegotiation = document.getElementById('col-negotiation').querySelectorAll('.lead-card').length;
  const colWon = document.getElementById('col-won').querySelectorAll('.lead-card').length;
  
  document.getElementById('badge-new').innerText = colNew;
  document.getElementById('badge-negotiation').innerText = colNegotiation;
  document.getElementById('badge-won').innerText = colWon;
}

// Comemoração ao fechar contrato (Feedback de Status da Metodologia DFH)
function triggerWonCelebration(card) {
  // Efeito de pulso verde esmeralda no card
  card.style.boxShadow = '0 0 25px var(--accent-emerald)';
  card.style.borderColor = 'var(--accent-emerald)';
  card.style.transition = 'all 0.3s ease';
  
  // Cria um pequeno balão/notificação elegante de sucesso
  const toast = document.createElement('div');
  toast.innerText = `🎉 Contrato Fechado com Sucesso!`;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.right = '30px';
  toast.style.background = 'var(--accent-emerald)';
  toast.style.color = '#FFF';
  toast.style.padding = '16px 28px';
  toast.style.borderRadius = '12px';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
  toast.style.zIndex = '999';
  toast.style.fontFamily = 'var(--font-title)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  toast.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  
  document.body.appendChild(toast);
  
  // Mostra a notificação
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 100);
  
  // Remove após 3.5 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      toast.remove();
    }, 500);
    
    // Remove o brilho do card de volta ao estado normal
    card.style.boxShadow = 'none';
    card.style.borderColor = 'rgba(255, 255, 255, 0.05)';
  }, 3500);
}


// --- 5. INTERAÇÃO DO FAQ (ACCORDION DE POBREMAS/DÚVIDAS) ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Fecha qualquer FAQ aberta anteriormente (Foco e redução de Carga Cognitiva)
    faqItems.forEach(i => i.classList.remove('active'));
    
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// Inicialização dos contadores na carga
window.addEventListener('DOMContentLoaded', () => {
  atualizarContadores();
});
