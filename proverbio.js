const proverbios = Array.from({length: 31}, (_, i) => i + 1)
    .flatMap(cap => Array.from({length: cap === 31 ? 32 : 32}, (_, ver) => ({
        texto: `Texto do provérbio ${cap}:${ver+1}...`,
        referencia: `Provérbios ${cap}:${ver+1}`
    })));

function getDailyProverbio() {
    const today = new Date().toISOString().slice(0, 10);
    const stored = localStorage.getItem('dailyProverbio');
    
    if (stored && stored.startsWith(today)) {
        return JSON.parse(stored.split('|')[1]);
    }

    const randomIndex = Math.floor(Math.random() * proverbios.length);
    const selected = proverbios[randomIndex];
    localStorage.setItem('dailyProverbio', `${today}|${JSON.stringify(selected)}`);
    return selected;
}

function updateProverbio() {
    const {texto, referencia} = getDailyProverbio();
    document.getElementById('proverbioTexto').textContent = texto;
    document.getElementById('proverbioReferencia').textContent = referencia;
}

async function shareProverbio() {
    try {
        const container = document.getElementById('proverbioContainer');
        
        const canvas = await html2canvas(container, {
            useCORS: true,
            scale: 2,
            backgroundColor: null
        });

        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'proverbio-diario.png', {type: 'image/png'});
            const shareData = {
                files: [file],
                title: 'Provérbio Diário',
                text: 'Confira o provérbio de hoje!'
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                const link = document.createElement('a');
                link.download = 'proverbio-diario.png';
                link.href = URL.createObjectURL(blob);
                link.click();
                alert('Imagem baixada! Agora você pode compartilhar pelo Instagram.');
            }
        });
    } catch (err) {
        console.error('Erro ao compartilhar:', err);
        alert('Erro ao compartilhar. Tente novamente mais tarde.');
    }
}

document.getElementById('shareButton').addEventListener('click', shareProverbio);
updateProverbio();
