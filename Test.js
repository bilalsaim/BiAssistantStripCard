
set hass(hass) {
    if (!this.content) {
        this.shadowRoot.innerHTML = `
            <style>
                .strip-card {
                    display: flex;
                    flex-direction: column;
                    background: linear-gradient(to bottom, #222, #444);
                    padding: 10px;
                    border-radius: 10px;
                    width: 200px;
                }
                .switch {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #333;
                    color: white;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .switch.on {
                    background: #FFD700;
                }
                .switch.off {
                    background: #333;
                }
                .mdi {
                    font-family: 'Material Design Icons';
                    font-style: normal;
                    font-size: 20px;
                    margin-right: 10px;
                }
            </style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css">
            <div class="strip-card">
                <h3>Strip Switches</h3>
                <div id="switches"></div>
            </div>
        `;
        this.content = this.shadowRoot.querySelector('#switches');
    }

    if (!this.config || !this.config.entities) {
        return;
    }
    
    this.content.innerHTML = '';
    this.config.entities.forEach(ent => {
        const state = hass.states[ent.entity]?.state;
        const icon = ent.icon || 'mdi-power';
        const switchEl = document.createElement('div');
        switchEl.className = `switch ${state === 'on' ? 'on' : 'off'}`;
        switchEl.innerHTML = `<i class="mdi ${icon}"></i> ${ent.name || ent.entity}`;
        switchEl.addEventListener('click', () => {
            hass.callService('homeassistant', 'toggle', { entity_id: ent.entity });
        });
        this.content.appendChild(switchEl);
    });
}

setConfig(config) {
    this.config = config;
}

getCardSize() {
    return 2;
}
}

customElements.define('strip-switch-card', StripSwitchCard);