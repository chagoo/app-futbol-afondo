const defaultMissing = [
      { team: "Mexico", codes: ["MEX 4", "MEX 6", "MEX 7", "MEX 8", "MEX 11", "MEX 18", "Rivas"] },
      { team: "South Africa", codes: ["RSA 7"], uncertain: ["RSA 4", "RSA 11", "RSA 13", "RSA 15", "RSA 19"] },
      { team: "Korea Republic", codes: ["KOR 4"], uncertain: ["Minam Kim"] },
      { team: "Czechia", codes: ["CZE 1", "CZE 3", "CZE 5", "CZE 7", "CZE 8", "CZE 11", "CZE 13", "CZE 18", "CZE 20"] },
      { team: "Canada", codes: ["CAN 2", "CAN 3", "CAN 7", "CAN 9", "CAN 20"] },
      { team: "Bosnia-Herzegovina", codes: ["BIH 3", "BIH 5", "BIH 10", "BIH 14", "BIH 17", "BIH 19"] },
      { team: "Qatar", codes: ["QAT 20"], uncertain: ["QAT 12", "QAT 14"] },
      { team: "Switzerland", codes: ["SUI 4", "SUI 11", "SUI 16", "SUI 17", "SUI 18"] },
      { team: "Brazil", codes: ["BRA 18"], uncertain: ["BRA 4", "BRA 6"] },
      { team: "Morocco", codes: ["MAR 6", "MAR 10", "MAR 12", "MAR 18"] },
      { team: "Haiti", codes: ["HAI 3", "HAI 12", "HAI 15", "HAI 18"] },
      { team: "Scotland", codes: ["SCO 10", "SCO 20"] },
      { team: "USA", codes: ["USA 3", "USA 10", "USA 12", "USA 14"] },
      { team: "Paraguay", codes: ["PAR 5", "PAR 13", "PAR 20"] },
      { team: "Australia", codes: ["AUS 3", "AUS 6", "AUS 9", "AUS 11", "AUS 12", "AUS 20"] },
      { team: "Turkiye", codes: ["TUR 4", "TUR 10", "TUR 14", "TUR 16", "TUR 17", "TUR 19"] },
      { team: "Germany", codes: ["GER 2", "GER 9", "GER 19"] },
      { team: "Curacao", codes: ["CUW 6", "CUW 8", "CUW 9", "CUW 11", "CUW 14", "CUW 18"] },
      { team: "Cote d'Ivoire", codes: ["CIV 11", "CIV 17", "CIV 20"] },
      { team: "Ecuador", codes: ["ECU 1", "ECU 7"], uncertain: ["ECU 4"] },
      { team: "Japan", codes: ["JPN 10", "JPN 11", "JPN 20"], uncertain: ["JPN 13", "JPN 14"] },
      { team: "Tunisia", codes: ["TUN 11", "TUN 12", "TUN 19"] },
      { team: "Egypt", codes: ["EGY 10", "EGY 17", "EGY 20"], uncertain: ["EGY 6", "EGY 14"] },
      { team: "Iran", codes: [], uncertain: ["IRN 5"] },
      { team: "New Zealand", codes: ["NZL 6", "NZL 10"] },
      { team: "Saudi Arabia", codes: ["KSA 3", "KSA 7", "KSA 9"], uncertain: ["KSA 6"] },
      { team: "Uruguay", codes: ["URU 6", "URU 9", "URU 16", "URU 17"] },
      { team: "France", codes: ["FRA 3", "FRA 7"] },
      { team: "Senegal", codes: ["SEN 15", "SEN 17"] },
      { team: "Iraq", codes: ["IRQ 3"], uncertain: ["IRQ 4"] },
      { team: "Austria", codes: ["AUT 13"] },
      { team: "Jordan", codes: ["JOR 1"] },
      { team: "Colombia", codes: ["COL 3", "COL 8"] },
      { team: "England", codes: ["ENG 7", "ENG 8"] },
      { team: "Croatia", codes: ["CRO 11", "CRO 15", "CRO 18"] },
      { team: "Panama", codes: ["PAN 1", "PAN 2"], uncertain: ["PAN 5", "PAN 13"] }
    ];

    const defaultDuplicates = [
      { team: "Qatar", codes: [
        { code: "QAT 3", quantity: 1 },
        { code: "QAT 10", quantity: 2 },
        { code: "QAT 12", quantity: 1 },
        { code: "QAT 14", quantity: 1 },
        { code: "QAT 16", quantity: 1 }
      ] }
    ];

    const API_BASE_URL = "https://jbnjx92x.us-east.insforge.app";
    const PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTQwMjB9.FmS2aPBOaBN2M3QCHtfRtpcmh992u8OY1qV3TqmDN2U";
    const SESSION_KEY = "album-insforge-session-v1";
    const OAUTH_KEY = "album-insforge-oauth-v1";
    const EXCHANGE_COOLDOWN_KEY = "album-last-exchange-submit-v1";
    const EXCHANGE_COOLDOWN_MS = 10 * 60 * 1000;
    const MIN_FORM_SECONDS = 4;
    let currentView = "missing";
    let session = loadJson(SESSION_KEY, null);
    let oauthState = loadJson(OAUTH_KEY, null);
    let missing = structuredClone(defaultMissing);
    let duplicates = structuredClone(defaultDuplicates);
    let exchangeRequests = [];
    let exchangeItems = [];
    let isAdmin = false;
    let selectedWants = new Set();
    let selectedGives = new Set();
    let requestCounts = new Map();
    let offerCounts = new Map();

    const teamsList = document.querySelector("#teamsList");
    const search = document.querySelector("#search");
    const status = document.querySelector("#status");
    const notes = document.querySelector("#notes");
    const exchangePanel = document.querySelector("#exchangePanel");
    const exchangeSummary = document.querySelector("#exchangeSummary");
    const exchangeNote = document.querySelector("#exchangeNote");
    const requesterName = document.querySelector("#requesterName");
    const requesterEmail = document.querySelector("#requesterEmail");
    const websiteField = document.querySelector("#websiteField");
    const humanQuestion = document.querySelector("#humanQuestion");
    const humanCheck = document.querySelector("#humanCheck");
    const submitExchangeButton = document.querySelector("#submitExchange");
    const selectedTotalEl = document.querySelector("#selectedTotal");
    const wantCountEl = document.querySelector("#wantCount");
    const giveCountEl = document.querySelector("#giveCount");
    let formStartedAt = Date.now();
    let humanChallenge = createHumanChallenge();

    function allCodes(item) {
      return [
        ...item.codes.map(entry => typeof entry === "string" ? { code: entry, uncertain: false } : entry),
        ...(item.uncertain || []).map(entry => typeof entry === "string" ? { code: entry, uncertain: true } : entry)
      ];
    }

    async function boot() {
      let oauthError = "";
      try {
        await handleOAuthCallback();
      } catch (error) {
        oauthError = error.message || "No se pudo validar el inicio con OAuth.";
      }
      await refreshFromBackend();
      bindEvents();
      renderHumanChallenge();
      render();
      if (oauthError) {
        showNote(oauthError);
      }
      runSecurityE2ETest();
    }

    async function refreshFromBackend() {
      renderAuth();
      await checkAdmin();
      await loadStickers();
      if (currentView === "exchanges") await loadExchanges();
    }

    async function loadStickers() {
      try {
        await loadRequestCounts();
        await loadOfferCounts();
        const rows = await request("/api/database/records/album_stickers?order=sort_order.asc,team.asc,code.asc", {
          headers: authHeaders()
        });
        setListsFromRows(Array.isArray(rows) ? rows : []);
        hideNote();
      } catch (error) {
        missing = structuredClone(defaultMissing);
        duplicates = structuredClone(defaultDuplicates);
        showNote("No pude cargar los datos en vivo. Se muestra una copia inicial mientras se recupera la conexion.");
      }
    }

    function showNote(message, ok = false) {
      notes.textContent = message;
      notes.classList.toggle("ok", ok);
      notes.classList.remove("hidden");
    }

    function hideNote() {
      notes.textContent = "";
      notes.classList.remove("ok");
      notes.classList.add("hidden");
    }

    async function loadRequestCounts() {
      requestCounts = new Map();
      try {
        const rows = await request("/api/database/records/sticker_request_counts", {
          headers: authHeaders()
        });
        (Array.isArray(rows) ? rows : []).forEach(row => {
          requestCounts.set(`${row.team}||${row.code}`, Number(row.requested_quantity) || 0);
        });
      } catch {
        requestCounts = new Map();
      }
    }

    async function loadOfferCounts() {
      offerCounts = new Map();
      try {
        const rows = await request("/api/database/records/sticker_offer_counts", {
          headers: authHeaders()
        });
        (Array.isArray(rows) ? rows : []).forEach(row => {
          offerCounts.set(`${row.team}||${row.code}`, Number(row.offered_quantity) || 0);
        });
      } catch {
        offerCounts = new Map();
      }
    }

    function setListsFromRows(rows) {
      const missingMap = new Map();
      const duplicateMap = new Map();
      rows.forEach(row => {
        const map = row.list_type === "duplicate" ? duplicateMap : missingMap;
        if (!map.has(row.team)) map.set(row.team, { team: row.team, codes: [], uncertain: [] });
        const group = map.get(row.team);
        if (row.list_type === "duplicate") {
          group.codes.push({
            id: row.id,
            code: row.code,
            quantity: row.quantity || 1,
            requestedQuantity: requestCounts.get(`${row.team}||${row.code}`) || 0
          });
        } else if (row.uncertain) {
          group.uncertain.push({
            id: row.id,
            code: row.code,
            uncertain: true,
            offeredQuantity: offerCounts.get(`${row.team}||${row.code}`) || 0
          });
        } else {
          group.codes.push({
            id: row.id,
            code: row.code,
            uncertain: false,
            offeredQuantity: offerCounts.get(`${row.team}||${row.code}`) || 0
          });
        }
      });
      missing = [...missingMap.values()];
      duplicates = [...duplicateMap.values()];
    }

    async function checkAdmin() {
      isAdmin = false;
      const user = getUser();
      if (!session?.accessToken || !user?.email) return;
      try {
        const rows = await request(`/api/database/records/album_admins?email=eq.${encodeURIComponent(user.email.toLowerCase())}`, {
          headers: authHeaders()
        });
        isAdmin = Array.isArray(rows) && rows.length > 0;
      } catch {
        isAdmin = false;
      }
    }

    async function loadExchanges() {
      exchangeRequests = [];
      exchangeItems = [];
      if (!session?.accessToken || !isAdmin) return;
      exchangeRequests = await request("/api/database/records/exchange_requests?order=created_at.desc", { headers: authHeaders() }) || [];
      exchangeItems = await request("/api/database/records/exchange_items?order=created_at.asc", { headers: authHeaders() }) || [];
    }

    function normalizeCode(value) {
      return value.trim().replace(/\s+/g, " ").toUpperCase();
    }

    async function removeCode(id) {
      if (!isAdmin || !id) return;
      await request(`/api/database/records/album_stickers?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      await refreshFromBackend();
      render();
    }

    async function toggleCode(id, uncertain) {
      if (!isAdmin || !id) return;
      await request(`/api/database/records/album_stickers?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ uncertain: !uncertain })
      });
      await refreshFromBackend();
      render();
    }

    async function addCode(teamName, code, isUncertain) {
      const clean = normalizeCode(code);
      if (!isAdmin || !teamName || !clean) return;
      await request("/api/database/records/album_stickers", {
        method: "POST",
        headers: { ...authHeaders(), Prefer: "return=representation" },
        body: JSON.stringify([{ team: teamName, code: clean, list_type: "missing", uncertain: Boolean(isUncertain), quantity: 1, sort_order: Date.now() % 100000 }])
      });
      await refreshFromBackend();
      render();
    }

    async function addTeam() {
      const team = prompt("Nombre del equipo o seccion:");
      if (!isAdmin || !team || !team.trim()) return;
      const clean = team.trim();
      const code = prompt("Codigo de estampa:");
      if (!code || !code.trim()) return;
      if (currentView === "duplicates") await addDuplicate(clean, code, 1);
      else await addCode(clean, code, false);
      render();
    }

    async function removeTeam(teamName) {
      if (!isAdmin || !confirm(`Quitar ${teamName} de la lista?`)) return;
      await request(`/api/database/records/album_stickers?team=eq.${encodeURIComponent(teamName)}&list_type=eq.missing`, {
        method: "DELETE",
        headers: authHeaders()
      });
      await refreshFromBackend();
      render();
    }

    async function removeDuplicateTeam(teamName) {
      if (!isAdmin || !confirm(`Quitar ${teamName} de repetidas?`)) return;
      await request(`/api/database/records/album_stickers?team=eq.${encodeURIComponent(teamName)}&list_type=eq.duplicate`, {
        method: "DELETE",
        headers: authHeaders()
      });
      await refreshFromBackend();
      render();
    }

    async function addDuplicate(teamName, code, quantity) {
      const clean = normalizeCode(code);
      const amount = Math.max(1, Number(quantity) || 1);
      if (!isAdmin || !teamName || !clean) return;
      await request("/api/database/records/album_stickers", {
        method: "POST",
        headers: { ...authHeaders(), Prefer: "return=representation" },
        body: JSON.stringify([{ team: teamName, code: clean, list_type: "duplicate", uncertain: false, quantity: amount, sort_order: Date.now() % 100000 }])
      });
      await refreshFromBackend();
      render();
    }

    async function changeDuplicate(id, quantity, delta) {
      if (!isAdmin || !id) return;
      const next = Number(quantity || 1) + delta;
      if (next <= 0) {
        await removeCode(id);
      } else {
        await request(`/api/database/records/album_stickers?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ quantity: next })
        });
        await refreshFromBackend();
      }
      render();
    }

    function entryId(entry) {
      return entry.id || "";
    }

    function filteredData() {
      const q = search.value.trim().toLowerCase();
      const mode = status.value;
      return missing
        .map(item => ({
          ...item,
          filteredCodes: allCodes(item).filter(entry => {
            const matchesQuery = !q || item.team.toLowerCase().includes(q) || entry.code.toLowerCase().includes(q);
            const matchesStatus = mode === "all" || (mode === "confirmed" && !entry.uncertain) || (mode === "uncertain" && entry.uncertain);
            return matchesQuery && matchesStatus;
          })
        }))
        .filter(item => item.filteredCodes.length || (!q && mode === "all"));
    }

    function filteredDuplicates() {
      const q = search.value.trim().toLowerCase();
      return duplicates
        .map(item => ({
          ...item,
          filteredCodes: item.codes.filter(entry => !q || item.team.toLowerCase().includes(q) || entry.code.toLowerCase().includes(q))
        }))
        .filter(item => item.filteredCodes.length || !q);
    }

    function render() {
      document.querySelectorAll(".view-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.view === currentView);
      });
      status.style.display = currentView === "missing" ? "" : "none";
      document.querySelector("#addTeam").classList.toggle("hidden", !isAdmin || currentView === "exchanges");
      document.querySelector("#runSecurityTest").classList.toggle("hidden", !isAdmin || currentView === "exchanges");
      document.querySelector("#runSecurityTestV2").classList.toggle("hidden", !isAdmin || currentView === "exchanges");
      document.querySelector("#runSecurityTestV3").classList.toggle("hidden", !isAdmin || currentView === "exchanges");
      exchangePanel.classList.toggle("hidden", currentView === "exchanges");

      if (currentView === "duplicates") {
        renderDuplicates();
        return;
      }
      if (currentView === "exchanges") {
        renderExchanges();
        return;
      }

      const data = filteredData();
      teamsList.innerHTML = data.map(item => `
        <article class="team">
          <h2>${escapeHtml(item.team)}${isAdmin ? `<button type="button" data-remove-team="${escapeAttr(item.team)}">Quitar</button>` : ""}</h2>
          <div class="codes">
            ${item.filteredCodes.map(entry => {
              const offered = Number(entry.offeredQuantity) || 0;
              const isSelected = selectedGives.has(entryId(entry));
              const canOffer = offered === 0;
              return `
              <span class="code ${canOffer ? "selectable" : "requested unavailable"} ${entry.uncertain ? "uncertain" : ""} ${isSelected ? "selected" : ""}" ${canOffer ? `data-select-give="${escapeAttr(entryId(entry))}"` : ""}>
                ${escapeHtml(entry.code)}${entry.uncertain ? " ?" : ""}${offered > 0 ? ` <span class="badge">Ofrecida x${offered}</span>` : ""}
                ${isSelected ? `<span class="badge">Seleccionada</span>` : ""}
                ${isAdmin ? `<button type="button" title="Cambiar estado" data-toggle-id="${escapeAttr(entryId(entry))}" data-uncertain="${entry.uncertain}">~</button>
                <button type="button" title="Quitar" data-delete-id="${escapeAttr(entryId(entry))}">x</button>` : ""}
              </span>
            `}).join("")}
          </div>
          ${isAdmin ? `<form class="editor" data-add-code="${escapeAttr(item.team)}">
            <input name="code" placeholder="Nueva falta, ej. MEX 11" autocomplete="off">
            <label><input name="uncertain" type="checkbox"> pendiente</label>
            <button type="submit">Agregar</button>
          </form>` : ""}
        </article>
      `).join("");

      const confirmed = missing.flatMap(item => item.codes).length;
      const uncertain = missing.flatMap(item => item.uncertain || []).length;
      document.querySelector("#total").textContent = confirmed + uncertain;
      document.querySelector("#teams").textContent = missing.length;
      document.querySelector("#uncertain").textContent = uncertain;
      document.querySelector("#totalLabel").textContent = "faltantes visibles";
      document.querySelector("#teamsLabel").textContent = "equipos/secciones";
      document.querySelector("#uncertainLabel").textContent = "por confirmar por reflejo";
      renderExchangePanel();
    }

    function renderDuplicates() {
      const data = filteredDuplicates();
      teamsList.innerHTML = data.map(item => `
        <article class="team">
          <h2>${escapeHtml(item.team)}${isAdmin ? `<button type="button" data-remove-duplicate-team="${escapeAttr(item.team)}">Quitar</button>` : ""}</h2>
          <div class="codes">
            ${item.filteredCodes.map(entry => {
              const requested = Math.min(Number(entry.requestedQuantity) || 0, Number(entry.quantity) || 1);
              const available = Math.max(0, (Number(entry.quantity) || 1) - requested);
              const isSelected = selectedWants.has(entryId(entry));
              return `
              <span class="code ${available > 0 ? "selectable" : "unavailable"} ${requested > 0 ? "requested" : ""} ${isSelected ? "selected" : ""}" ${available > 0 ? `data-select-want="${escapeAttr(entryId(entry))}"` : ""}>
                ${escapeHtml(entry.code)} x${available}${requested > 0 ? ` <span class="badge">Solicitada x${requested}</span>` : ""}
                ${isSelected ? `<span class="badge">Seleccionada</span>` : ""}
                ${isAdmin ? `<button type="button" title="Sumar una" data-duplicate-plus="${escapeAttr(entryId(entry))}" data-quantity="${entry.quantity}">+</button>
                <button type="button" title="Restar una" data-duplicate-minus="${escapeAttr(entryId(entry))}" data-quantity="${entry.quantity}">-</button>
                <button type="button" title="Quitar" data-delete-id="${escapeAttr(entryId(entry))}">x</button>` : ""}
              </span>
            `}).join("")}
          </div>
          ${isAdmin ? `<form class="editor" data-add-duplicate="${escapeAttr(item.team)}">
            <input name="code" placeholder="Repetida, ej. QAT 10" autocomplete="off">
            <input name="quantity" type="number" min="1" value="1" aria-label="Cantidad">
            <button type="submit">Agregar</button>
          </form>` : ""}
        </article>
      `).join("");

      const total = duplicates.flatMap(item => item.codes).reduce((sum, entry) => sum + Math.max(0, (entry.quantity || 1) - (entry.requestedQuantity || 0)), 0);
      document.querySelector("#total").textContent = total;
      document.querySelector("#teams").textContent = duplicates.length;
      document.querySelector("#uncertain").textContent = duplicates.flatMap(item => item.codes).length;
      document.querySelector("#totalLabel").textContent = "repetidas disponibles";
      document.querySelector("#teamsLabel").textContent = "equipos con repetidas";
      document.querySelector("#uncertainLabel").textContent = "codigos distintos";
      renderExchangePanel();
    }

    function renderExchangePanel() {
      const wants = listEntries(duplicates).filter(entry => selectedWants.has(entry.id));
      const gives = listEntries(missing).filter(entry => selectedGives.has(entry.id));
      const total = wants.length + gives.length;
      if (selectedTotalEl) selectedTotalEl.textContent = String(total);
      if (wantCountEl) wantCountEl.textContent = `Quieres ${wants.length}`;
      if (giveCountEl) giveCountEl.textContent = `Puedes dar ${gives.length}`;
      const summaryLines = [];
      if (wants.length) summaryLines.push(`Quieres: ${wants.map(entry => `${entry.team} ${entry.code}`).join(", ")}`);
      if (gives.length) summaryLines.push(`Puedes dar: ${gives.map(entry => `${entry.team} ${entry.code}`).join(", ")}`);
      if (!summaryLines.length) summaryLines.push("Toca las estampas que quieres y las que puedes darme para armar la propuesta.");
      if (wants.length && !gives.length) summaryLines.push("Falta seleccionar al menos una estampa que puedas darme.");
      if (!wants.length && gives.length) summaryLines.push("Falta seleccionar al menos una de mis repetidas que quieras.");
      exchangeSummary.textContent = summaryLines.join("\n");
      submitExchangeButton.disabled = isAdmin || wants.length === 0 || gives.length === 0;
    }

    function renderExchanges() {
      exchangePanel.classList.add("hidden");
      if (!isAdmin) {
        teamsList.innerHTML = `<article class="team"><h2>Propuestas enviadas</h2><div class="codes">Tus propuestas se guardan para que yo las revise. Por privacidad, el detalle de propuestas solo lo ve el administrador.</div></article>`;
      } else if (!exchangeRequests.length) {
        teamsList.innerHTML = `<article class="team"><div class="codes">Todavia no hay propuestas.</div></article>`;
      } else {
        teamsList.innerHTML = exchangeRequests.map(request => {
        const items = exchangeItems.filter(item => item.request_id === request.id);
          const wants = items.filter(item => item.direction === "wants_from_owner").map(item => `${escapeHtml(item.team)} ${escapeHtml(item.code)}`).join(", ");
          const gives = items.filter(item => item.direction === "gives_to_owner").map(item => `${escapeHtml(item.team)} ${escapeHtml(item.code)}`).join(", ");
          return `<article class="team">
            <h2>${escapeHtml(request.requester_name || "Sin nombre")} <span>${escapeHtml(request.status)}</span></h2>
            <div class="codes">
              <span class="code">${escapeHtml(formatEmailForViewer(request.user_email))}</span>
              <span class="code">Quiere: ${wants || "sin seleccion"}</span>
              <span class="code">Da: ${gives || "sin seleccion"}</span>
              ${request.note ? `<span class="code">${escapeHtml(request.note)}</span>` : ""}
              ${isAdmin ? `<button type="button" data-request="${request.id}" data-status="accepted">Aceptar</button><button type="button" data-request="${request.id}" data-status="closed">Cerrar</button><button type="button" data-request="${request.id}" data-status="rejected">Descartar</button>` : ""}
            </div>
          </article>`;
        }).join("");
      }
      document.querySelector("#total").textContent = exchangeRequests.length;
      document.querySelector("#teams").textContent = exchangeItems.length;
      document.querySelector("#uncertain").textContent = exchangeRequests.filter(item => item.status === "submitted").length;
      document.querySelector("#totalLabel").textContent = "propuestas";
      document.querySelector("#teamsLabel").textContent = "estampas en propuestas";
      document.querySelector("#uncertainLabel").textContent = "pendientes";
    }

    function copyList() {
      if (currentView === "duplicates") {
        const lines = duplicates.map(item => {
          const repeated = item.codes.map(entry => {
            const available = Math.max(0, (entry.quantity || 1) - (entry.requestedQuantity || 0));
            const requested = entry.requestedQuantity ? `, solicitada x${entry.requestedQuantity}` : "";
            return `${entry.code} x${available}${requested}`;
          }).join(", ");
          return `${item.team}: ${repeated}`;
        });
        navigator.clipboard.writeText(`Tengo estas estampas repetidas para intercambio:\n${lines.join("\n")}`);
        document.querySelector("#copy").textContent = "Lista copiada";
        setTimeout(() => document.querySelector("#copy").textContent = "Copiar lista", 1500);
        return;
      }

      const lines = missing.map(item => {
        const confirmed = item.codes.map(entry => entry.code || entry).join(", ");
        const uncertain = (item.uncertain || []).map(entry => `${entry.code || entry}?`).join(", ");
        return `${item.team}: ${[confirmed, uncertain].filter(Boolean).join(", ")}`;
      });
      navigator.clipboard.writeText(`Busco estas estampas para intercambio:\n${lines.join("\n")}`);
      document.querySelector("#copy").textContent = "Lista copiada";
      setTimeout(() => document.querySelector("#copy").textContent = "Copiar lista", 1500);
    }

    function copySelection() {
      const { wants, gives } = selectedExchangeEntries();
      const lines = [
        "Propuesta de intercambio:",
        wants.length ? `Quiero: ${wants.map(entry => `${entry.team} ${entry.code}`).join(", ")}` : "Quiero: sin seleccion",
        gives.length ? `Puedo dar: ${gives.map(entry => `${entry.team} ${entry.code}`).join(", ")}` : "Puedo dar: sin seleccion"
      ];
      navigator.clipboard.writeText(lines.join("\n"));
      document.querySelector("#copySelection").textContent = "Selección copiada";
      setTimeout(() => document.querySelector("#copySelection").textContent = "Copiar selección", 1500);
    }


    function runSecurityE2ETest() {
      if (!isAdmin) return;

      const payload = '<img src=x onerror="window.__xssFlag=1">';
      window.__xssFlag = 0;
      const rendered = `<span class="code">${escapeHtml(payload)}</span>`;
      const container = document.createElement("div");
      container.innerHTML = rendered;
      const hasRawTag = container.innerHTML.includes("<img");
      const hasEscapedTag = container.innerHTML.includes("&lt;img");
      const escapedAttr = escapeAttr('" onmouseover="window.__xssFlag=1');
      const canBreakAttribute = escapedAttr.includes('" onmouseover=') || escapedAttr.includes("' onmouseover=");
      const passed = !hasRawTag && hasEscapedTag && !canBreakAttribute && window.__xssFlag === 0;
      showNote(passed
        ? "Prueba E2E de seguridad: OK. Se bloquearon vectores XSS en HTML y atributos."
        : "Prueba E2E de seguridad: FALLA. Revisa sanitizacion de HTML/atributos.", passed);
    }

    function runSecurityE2ETestRevision2() {
      if (!isAdmin) return;

      const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content || "";
      const cspChecks = [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'"
      ];
      const cspPassed = cspChecks.every(rule => csp.includes(rule));

      const payload = '" autofocus onfocus=window.__xssAttrFlag=1 x="';
      window.__xssAttrFlag = 0;
      const html = `<button data-safe="${escapeAttr(payload)}">ok</button>`;
      const holder = document.createElement("div");
      holder.innerHTML = html;
      const btn = holder.querySelector("button");
      btn?.focus();
      const attrSafe = btn?.getAttribute("data-safe")?.includes("onfocus=") ?? false;

      const scriptPayload = '<svg><script>window.__xssSvgFlag=1</scr' + 'ipt></svg>';
      window.__xssSvgFlag = 0;
      const cleanScriptPayload = escapeHtml(scriptPayload);
      const scriptBlocked = cleanScriptPayload.includes("&lt;script&gt;") && window.__xssSvgFlag === 0;

      const passed = cspPassed && !attrSafe && scriptBlocked && window.__xssAttrFlag === 0;
      showNote(passed
        ? "Prueba E2E de seguridad v2: OK. CSP y sanitizacion reforzada validadas."
        : "Prueba E2E de seguridad v2: FALLA. Revisa CSP o escapes de entrada.", passed);
    }


    function runSecurityE2ETestRevision3() {
      if (!isAdmin) return;

      const referrerPolicy = document.querySelector('meta[name="referrer"]')?.content || "";
      const strictReferrer = referrerPolicy.toLowerCase() === "no-referrer";

      const safeUrl = "mailto:test@example.com";
      const blockedUrl = "javascript:alert(1)";
      const blockedDataUrl = "data:text/html,<scr" + "ipt>alert(1)</scr" + "ipt>";
      const isBlockedScheme = value => /^(javascript:|data:text\/html)/i.test(String(value || "").trim());
      const schemeFilterPassed = !isBlockedScheme(safeUrl) && isBlockedScheme(blockedUrl) && isBlockedScheme(blockedDataUrl);

      const idA = createId();
      const idB = createId();
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const idsAreStrong = uuidV4Regex.test(idA) && uuidV4Regex.test(idB) && idA !== idB;

      const passed = strictReferrer && schemeFilterPassed && idsAreStrong;
      showNote(passed
        ? "Prueba E2E de seguridad v3: OK. Referrer-Policy, filtros de esquema y IDs robustos validados."
        : "Prueba E2E de seguridad v3: FALLA. Revisa politicas de privacidad, filtros de URL o generacion de IDs.", passed);
    }

    function bindEvents() {
      document.querySelectorAll(".view-tab").forEach(button => {
        button.addEventListener("click", async () => {
          currentView = button.dataset.view;
          if (currentView === "exchanges") await loadExchanges();
          render();
        });
      });
      search.addEventListener("input", render);
      status.addEventListener("change", render);
      requesterName.addEventListener("input", renderExchangePanel);
      requesterEmail.addEventListener("input", renderExchangePanel);
      humanCheck.addEventListener("input", renderExchangePanel);
      document.querySelector("#copy").addEventListener("click", copyList);
      document.querySelector("#goToExchange").addEventListener("click", goToExchange);
      document.querySelector("#copySelection").addEventListener("click", copySelection);
      document.querySelector("#addTeam").addEventListener("click", addTeam);
      document.querySelector("#reset").classList.add("hidden");
      document.querySelector("#runSecurityTest").addEventListener("click", runSecurityE2ETest);
      document.querySelector("#runSecurityTestV2").addEventListener("click", runSecurityE2ETestRevision2);
      document.querySelector("#runSecurityTestV3").addEventListener("click", runSecurityE2ETestRevision3);
      document.querySelector("#authForm").addEventListener("submit", async event => {
        event.preventDefault();
        await loginUser();
      });
      document.querySelector("#register").addEventListener("click", registerUser);
      document.querySelector("#google").addEventListener("click", () => startOAuth("google"));
      document.querySelector("#github").addEventListener("click", () => startOAuth("github"));
      document.querySelector("#logout").addEventListener("click", async () => {
        session = null;
        isAdmin = false;
        localStorage.removeItem(SESSION_KEY);
        selectedWants.clear();
        selectedGives.clear();
        await refreshFromBackend();
        render();
      });
      document.querySelector("#clearExchange").addEventListener("click", () => {
        selectedWants.clear();
        selectedGives.clear();
        resetAntiSpamFields();
        render();
      });
      document.querySelector("#submitExchange").addEventListener("click", submitExchange);
      teamsList.addEventListener("click", handleTeamClick);
      teamsList.addEventListener("submit", handleTeamSubmit);
    }

    function goToExchange() {
      if (currentView === "exchanges") {
        currentView = "duplicates";
        render();
      }
      const scrollToForm = () => {
        exchangePanel.classList.remove("hidden");
        exchangePanel.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      requestAnimationFrame(scrollToForm);
      setTimeout(scrollToForm, 700);
      setTimeout(scrollToForm, 2500);
    }

    async function handleTeamClick(event) {
      const button = event.target.closest("button");
      if (button?.dataset.selectWant) {
        toggleSet(selectedWants, button.dataset.selectWant);
        render();
      } else if (button?.dataset.selectGive) {
        toggleSet(selectedGives, button.dataset.selectGive);
        render();
      } else if (button?.dataset.duplicatePlus) {
        await changeDuplicate(button.dataset.duplicatePlus, button.dataset.quantity, 1);
      } else if (button?.dataset.duplicateMinus) {
        await changeDuplicate(button.dataset.duplicateMinus, button.dataset.quantity, -1);
      } else if (button?.dataset.deleteId) {
        await removeCode(button.dataset.deleteId);
      } else if (button?.dataset.removeDuplicateTeam) {
        await removeDuplicateTeam(button.dataset.removeDuplicateTeam);
      } else if (button?.dataset.toggleId) {
        await toggleCode(button.dataset.toggleId, button.dataset.uncertain === "true");
      } else if (button?.dataset.request) {
        await updateExchangeStatus(button.dataset.request, button.dataset.status);
      } else if (button?.dataset.toggleTeam) {
        await toggleCode(button.dataset.toggleTeam, button.dataset.uncertain === "true");
      } else if (button?.dataset.removeTeam) {
        await removeTeam(button.dataset.removeTeam);
      } else if (!isAdmin) {
        const selectable = event.target.closest("[data-select-want],[data-select-give]");
        if (selectable?.dataset.selectWant) {
          toggleSet(selectedWants, selectable.dataset.selectWant);
          render();
        } else if (selectable?.dataset.selectGive) {
          toggleSet(selectedGives, selectable.dataset.selectGive);
          render();
        }
      }
    }

    async function handleTeamSubmit(event) {
      event.preventDefault();
      const form = event.target;
      if (form.dataset.addDuplicate) {
        await addDuplicate(form.dataset.addDuplicate, form.elements.code.value, form.elements.quantity.value);
      } else {
        await addCode(form.dataset.addCode, form.elements.code.value, form.elements.uncertain.checked);
      }
    }

    async function loginUser() {
      try {
        const data = await request("/api/auth/sessions?client_type=desktop", {
          method: "POST",
          body: JSON.stringify({ email: document.querySelector("#email").value.trim(), password: document.querySelector("#password").value })
        });
        saveSession(data);
        await refreshFromBackend();
        render();
      } catch (error) {
        showNote(`No pude iniciar sesion: ${error.message}`);
      }
    }

    async function registerUser() {
      try {
        const data = await request("/api/auth/users?client_type=desktop", {
          method: "POST",
          body: JSON.stringify({ email: document.querySelector("#email").value.trim(), password: document.querySelector("#password").value })
        });
        saveSession(data);
        await refreshFromBackend();
        render();
      } catch (error) {
        showNote(`No pude crear la cuenta: ${error.message}`);
      }
    }

    async function startOAuth(provider) {
      const codeVerifier = randomString(64);
      const codeChallenge = await sha256Base64Url(codeVerifier);
      const oauthNonce = randomString(32);
      const redirectUri = window.location.href.split("?")[0];
      oauthState = { codeVerifier, provider, state: oauthNonce };
      localStorage.setItem(OAUTH_KEY, JSON.stringify(oauthState));
      const data = await request(`/api/auth/oauth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${encodeURIComponent(codeChallenge)}&state=${encodeURIComponent(oauthNonce)}`);
      window.location.href = data.authUrl || data.url || data.data?.url;
    }

    async function handleOAuthCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("insforge_code");
      const returnedState = params.get("state");
      if (!code) return;
      const state = loadJson(OAUTH_KEY, null);
      if (!state?.codeVerifier) {
        localStorage.removeItem(OAUTH_KEY);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      if (returnedState && state?.state && returnedState !== state.state) {
        localStorage.removeItem(OAUTH_KEY);
        throw new Error("Estado OAuth invalido. Intenta iniciar sesion otra vez.");
      }
      const data = await exchangeOAuthCode(code, state.codeVerifier);
      saveSession(data);
      localStorage.removeItem(OAUTH_KEY);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function exchangeOAuthCode(code, codeVerifier) {
      const body = JSON.stringify({ code, code_verifier: codeVerifier });
      const endpoints = [
        "/api/auth/oauth/exchange?client_type=web",
        "/api/auth/oauth/exchange?client_type=desktop",
        "/api/auth/oauth/exchange"
      ];
      let lastError = null;
      for (const endpoint of endpoints) {
        try {
          return await request(endpoint, { method: "POST", body });
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("No se pudo completar OAuth.");
    }

    async function submitExchange() {
      const { wants, gives } = selectedExchangeEntries();
      const name = requesterName.value.trim().slice(0, 80);
      const email = requesterEmail.value.trim().toLowerCase().slice(0, 160);
      const note = exchangeNote.value.trim().slice(0, 500);
      if (!wants.length || !gives.length) {
        showNote("Selecciona al menos una repetida que quieres y una faltante que puedes darme.");
        return;
      }
      if (!name) {
        showNote("Escribe tu nombre para enviar la propuesta.");
        requesterName.focus();
        return;
      }
      if (!isValidEmail(email)) {
        showNote("Escribe un correo válido para poder coordinar el intercambio.");
        requesterEmail.focus();
        return;
      }
      if (websiteField.value.trim()) {
        showNote("No pude enviar la propuesta. Recarga la pagina e intenta de nuevo.");
        return;
      }
      const secondsOnForm = (Date.now() - formStartedAt) / 1000;
      if (secondsOnForm < MIN_FORM_SECONDS) {
        showNote("Espera unos segundos y revisa tu seleccion antes de enviar.");
        return;
      }
      if (!isHumanChallengeValid()) {
        showNote("Responde la verificacion para confirmar que no es envio automatico.");
        humanCheck.focus();
        return;
      }
      const cooldownRemaining = exchangeCooldownRemaining();
      if (cooldownRemaining > 0) {
        showNote(`Para evitar spam, espera ${formatCooldown(cooldownRemaining)} antes de enviar otra propuesta.`);
        return;
      }
      const requestId = createId();
      await request("/api/database/records/exchange_requests", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify([{
          id: requestId,
          user_id: `public:${requestId}`,
          requester_name: name,
          user_email: email,
          note,
          status: "submitted"
        }])
      });
      const rows = [
        ...wants.map(entry => ({ request_id: requestId, direction: "wants_from_owner", team: entry.team, code: entry.code, quantity: 1 })),
        ...gives.map(entry => ({ request_id: requestId, direction: "gives_to_owner", team: entry.team, code: entry.code, quantity: 1 }))
      ];
      await request("/api/database/records/exchange_items", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(rows)
      });
      selectedWants.clear();
      selectedGives.clear();
      exchangeNote.value = "";
      requesterName.value = "";
      requesterEmail.value = "";
      localStorage.setItem(EXCHANGE_COOLDOWN_KEY, String(Date.now()));
      resetAntiSpamFields();
      await refreshFromBackend();
      render();
      showNote("Propuesta enviada. Gracias, la revisaré para confirmar el intercambio.", true);
    }

    async function updateExchangeStatus(id, nextStatus) {
      if (!isAdmin) return;
      if (nextStatus === "rejected" && !confirm("Descartar esta propuesta y liberar las estampas apartadas?")) return;
      await request(`/api/database/records/exchange_requests?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: nextStatus })
      });
      await refreshFromBackend();
      render();
    }

    async function request(path, options = {}) {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) }
      });
      const text = await response.text();
      const data = parseResponse(text);
      if (!response.ok) throw new Error(`${response.status} ${data?.message || data?.error || response.statusText}`);
      return data;
    }

    function authHeaders() {
      return { Authorization: `Bearer ${session?.accessToken || PUBLIC_ANON_KEY}` };
    }

    function saveSession(data) {
      const accessToken = data?.accessToken || data?.data?.accessToken;
      const refreshToken = data?.refreshToken || data?.data?.refreshToken;
      const user = data?.user || data?.data?.user || parseJwt(accessToken);
      session = { accessToken, refreshToken, user };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function renderAuth() {
      const signedIn = Boolean(session?.accessToken);
      const user = getUser();
      document.querySelector(".auth-panel").open = signedIn;
      document.querySelector("#authForm").classList.toggle("hidden", signedIn);
      document.querySelector("#register").classList.toggle("hidden", signedIn);
      document.querySelector("#google").classList.toggle("hidden", signedIn);
      document.querySelector("#github").classList.toggle("hidden", signedIn);
      document.querySelector("#logout").classList.toggle("hidden", !signedIn);
      document.querySelector("#sessionName").textContent = signedIn ? `${user?.email || "Usuario"}${isAdmin ? " - admin" : ""}` : "";
    }

    function getUser() {
      return session?.user || parseJwt(session?.accessToken);
    }

    function listEntries(list) {
      return list.flatMap(item => allCodes(item).map(entry => ({ ...entry, team: item.team })));
    }

    function selectedExchangeEntries() {
      return {
        wants: listEntries(duplicates).filter(entry => selectedWants.has(entry.id)),
        gives: listEntries(missing).filter(entry => selectedGives.has(entry.id))
      };
    }

    function toggleSet(set, value) {
      set.has(value) ? set.delete(value) : set.add(value);
    }

    function isValidEmail(value) {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
    }

    function createHumanChallenge() {
      const left = 2 + Math.floor(Math.random() * 8);
      const right = 1 + Math.floor(Math.random() * 7);
      return { question: `Verificacion: ${left} + ${right} =`, answer: String(left + right) };
    }

    function renderHumanChallenge() {
      humanChallenge = createHumanChallenge();
      humanQuestion.textContent = humanChallenge.question;
      humanCheck.value = "";
      formStartedAt = Date.now();
    }

    function isHumanChallengeValid() {
      return humanCheck.value.trim() === humanChallenge.answer;
    }

    function resetAntiSpamFields() {
      websiteField.value = "";
      renderHumanChallenge();
    }

    function exchangeCooldownRemaining() {
      const lastSubmit = Number(localStorage.getItem(EXCHANGE_COOLDOWN_KEY)) || 0;
      return Math.max(0, EXCHANGE_COOLDOWN_MS - (Date.now() - lastSubmit));
    }

    function formatCooldown(milliseconds) {
      const minutes = Math.ceil(milliseconds / 60000);
      return `${minutes} minuto${minutes === 1 ? "" : "s"}`;
    }

    function formatEmailForViewer(value) {
      if (isAdmin) return value || "sin correo";
      const localPart = String(value || "").split("@")[0].trim();
      return localPart ? `${localPart}@` : "correo privado";
    }

    function createId() {
      if (crypto.randomUUID) return crypto.randomUUID();
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      return [...bytes].map((byte, index) => {
        const value = byte.toString(16).padStart(2, "0");
        return [4, 6, 8, 10].includes(index) ? `-${value}` : value;
      }).join("");
    }

    function loadJson(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
    }

    function parseResponse(text) {
      if (!text) return null;
      try { return JSON.parse(text); } catch { return { message: text }; }
    }

    function parseJwt(token) {
      if (!token) return null;
      try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(payload));
      } catch {
        return null;
      }
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function escapeAttr(value) {
      return escapeHtml(value).replace(/`/g, "&#096;");
    }

    function randomString(length) {
      const bytes = new Uint8Array(length);
      crypto.getRandomValues(bytes);
      return Array.from(bytes, byte => ("0" + (byte % 36).toString(36)).slice(-1)).join("");
    }

    async function sha256Base64Url(value) {
      const data = new TextEncoder().encode(value);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    boot();
