class NovaHeroCard extends HTMLElement {
  setConfig(config) {
    this.config = config || {};
    if (!window.__novaFraunces) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap';
      document.head.appendChild(link);
      window.__novaFraunces = true;
    }
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block}
        ha-card{background:linear-gradient(175deg,var(--card-background-color,#1e1712),#19140fdd);
          border:1px solid var(--divider-color,#33291f);border-radius:var(--ha-card-border-radius,16px);
          padding:24px 26px;display:flex;align-items:center;gap:24px;flex-wrap:wrap;overflow:hidden;}
        .core{width:64px;height:64px;border-radius:50%;flex:none;
          background:radial-gradient(circle at 36% 30%, #ffe3ad, #f4b860 40%, #e2542f 78%, #6d220f 100%);
          box-shadow:0 0 30px 4px #e2542f45, inset 0 0 18px 2px #ffe3ad30;
          animation:novaBreathe 5s ease-in-out infinite;}
        @keyframes novaBreathe{0%,100%{box-shadow:0 0 14px 1px #e2542f4a}50%{box-shadow:0 0 26px 6px #e2542f70}}
        @media (prefers-reduced-motion:reduce){.core{animation:none}}
        .text{flex:1;min-width:180px}
        .time{font-family:'Fraunces',var(--paper-font-headline_-_font-family,serif);font-size:27px;font-weight:600;
          color:var(--primary-text-color,#f3ece1);line-height:1.1}
        .date{font-family:var(--code-font-family,monospace);font-size:11px;letter-spacing:.06em;text-transform:uppercase;
          color:var(--secondary-text-color,#a89a89);margin-top:3px}
        .chips{display:flex;flex-wrap:wrap;gap:8px}
        .chip{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:20px;
          background:var(--secondary-background-color,#1e1712);border:1px solid var(--divider-color,#33291f);
          font-family:var(--code-font-family,monospace);font-size:11px;color:var(--secondary-text-color,#a89a89);
          white-space:nowrap;}
        .dot{width:6px;height:6px;border-radius:50%;background:#5fbf7a;flex:none}
        .dot.warn{background:#e8b23d}
        .dot.alert{background:#ff5a5a}
        .chip b{color:var(--primary-text-color,#f3ece1);font-weight:600}
      </style>
      <ha-card>
        <div class="core"></div>
        <div class="text">
          <div class="time"></div>
          <div class="date"></div>
        </div>
        <div class="chips"></div>
      </ha-card>`;
    this._timeEl = this.shadowRoot.querySelector('.time');
    this._dateEl = this.shadowRoot.querySelector('.date');
    this._chipsEl = this.shadowRoot.querySelector('.chips');
    this._tick();
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(() => this._tick(), 30000);
  }

  _tick() {
    const now = new Date();
    if (this._timeEl) this._timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (this._dateEl) this._dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._chipsEl) return;
    const states = hass.states;
    let lightsOn = 0;
    for (const id in states) {
      if (id.startsWith('light.') && states[id].state === 'on') lightsOn++;
    }
    const alarmEntity = this.config.alarm_entity;
    const alarmState = alarmEntity && states[alarmEntity] ? states[alarmEntity].state : null;
    const chips = [];
    if (alarmState) {
      const cls = alarmState === 'disarmed' ? 'warn' : (alarmState.indexOf('armed') === 0 ? '' : 'alert');
      chips.push(`<span class="chip"><span class="dot ${cls}"></span>Alarm <b>${alarmState.replace(/_/g, ' ')}</b></span>`);
    }
    chips.push(`<span class="chip"><span class="dot"></span><b>${lightsOn}</b> light${lightsOn === 1 ? '' : 's'} on</span>`);
    this._chipsEl.innerHTML = chips.join('');
  }

  getCardSize() { return 2; }
  static getStubConfig() { return { alarm_entity: 'alarm_control_panel.home_security' }; }
}
customElements.define('nova-hero-card', NovaHeroCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'nova-hero-card', name: 'Nova Hero', description: 'Animated ember/gold status hero' });
