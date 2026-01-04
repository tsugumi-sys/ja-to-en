const catalogUrl = "data/catalog.yaml";

const dramaSelect = document.getElementById("dramaSelect");
const seasonSelect = document.getElementById("seasonSelect");
const episodeSelect = document.getElementById("episodeSelect");
const episodeTitle = document.getElementById("episodeTitle");
const episodeCount = document.getElementById("episodeCount");
const issuesEl = document.getElementById("issues");

let catalog = null;

const clearChildren = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const buildOption = (value, label) => {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
};

const getSelectedDrama = () => {
  if (!catalog || !catalog.dramas || catalog.dramas.length === 0) return null;
  return catalog.dramas.find((drama) => drama.id === dramaSelect.value) || catalog.dramas[0];
};

const getSelectedSeason = (drama) => {
  if (!drama || !drama.seasons || drama.seasons.length === 0) return null;
  const seasonNumber = Number(seasonSelect.value);
  return drama.seasons.find((season) => season.season === seasonNumber) || drama.seasons[0];
};

const getSelectedEpisode = (season) => {
  if (!season || !season.episodes || season.episodes.length === 0) return null;
  const episodeNumber = Number(episodeSelect.value);
  return season.episodes.find((episode) => episode.episode === episodeNumber) || season.episodes[0];
};

const populateDramaSelect = () => {
  clearChildren(dramaSelect);
  catalog.dramas.forEach((drama) => {
    dramaSelect.appendChild(buildOption(drama.id, drama.name));
  });
};

const populateSeasonSelect = (drama) => {
  clearChildren(seasonSelect);
  if (!drama) return;
  drama.seasons.forEach((season) => {
    seasonSelect.appendChild(buildOption(String(season.season), `Season ${season.season}`));
  });
};

const populateEpisodeSelect = (season) => {
  clearChildren(episodeSelect);
  if (!season) return;
  season.episodes.forEach((episode) => {
    episodeSelect.appendChild(
      buildOption(String(episode.episode), `Episode ${episode.episode}`)
    );
  });
};

const renderIssues = (items) => {
  clearChildren(issuesEl);
  if (!items || items.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No lines found for this episode.";
    issuesEl.appendChild(empty);
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "issue";
    card.style.animationDelay = `${index * 0.03}s`;

    const jp = document.createElement("p");
    jp.className = "jp";
    jp.textContent = item.jp || "";

    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Click to reveal English";

    const en = document.createElement("p");
    en.className = "en";
    en.textContent = item.en || "";

    card.appendChild(jp);
    card.appendChild(hint);
    card.appendChild(en);

    card.addEventListener("click", () => {
      card.classList.toggle("revealed");
      hint.textContent = card.classList.contains("revealed")
        ? "Click to hide English"
        : "Click to reveal English";
    });

    issuesEl.appendChild(card);
  });
};

const updateEpisodeMeta = (episodeData) => {
  const title = episodeData?.title ? `Episode: ${episodeData.title}` : "Select an episode";
  const count = episodeData?.items ? `${episodeData.items.length} lines` : "0 lines";
  episodeTitle.textContent = `${title} (${count})`;
  episodeCount.textContent = "";
};

const loadEpisode = async () => {
  const drama = getSelectedDrama();
  const season = getSelectedSeason(drama);
  const episode = getSelectedEpisode(season);

  if (!episode || !episode.file) {
    updateEpisodeMeta(null);
    renderIssues([]);
    return;
  }

  try {
    const response = await fetch(episode.file);
    if (!response.ok) throw new Error("Failed to load episode");
    const yamlText = await response.text();
    const episodeData = jsyaml.load(yamlText);

    updateEpisodeMeta(episodeData);
    renderIssues(episodeData.items || []);
  } catch (error) {
    updateEpisodeMeta(null);
    renderIssues([]);
  }
};

const bootstrap = async () => {
  try {
    const response = await fetch(catalogUrl);
    if (!response.ok) throw new Error("Failed to load catalog");
    const yamlText = await response.text();
    catalog = jsyaml.load(yamlText);

    if (!catalog?.dramas?.length) {
      renderIssues([]);
      return;
    }

    populateDramaSelect();
    const drama = getSelectedDrama();
    populateSeasonSelect(drama);
    const season = getSelectedSeason(drama);
    populateEpisodeSelect(season);

    await loadEpisode();
  } catch (error) {
    renderIssues([]);
  }
};

dramaSelect.addEventListener("change", async () => {
  const drama = getSelectedDrama();
  populateSeasonSelect(drama);
  const season = getSelectedSeason(drama);
  populateEpisodeSelect(season);
  await loadEpisode();
});

seasonSelect.addEventListener("change", async () => {
  const drama = getSelectedDrama();
  const season = getSelectedSeason(drama);
  populateEpisodeSelect(season);
  await loadEpisode();
});

episodeSelect.addEventListener("change", loadEpisode);

bootstrap();
