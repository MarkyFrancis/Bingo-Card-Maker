const VOCABULARY = [
  'HTML', 'Attribute', '<h1>', '<p>', '<a>', '<img>', '<audio>', '<video>', '<table>', '<tr>', '<td>', '<form>',
  'CSS', 'Selector', 'Class Selector', 'ID Selector', 'Inline CSS', 'Internal CSS', 'External CSS', 'Border',
  'Padding', 'Margin', 'Background Color', 'Border Radius', 'JavaScript', 'Variable', 'Data Types',
  'Local Variable', 'Global Variable', 'Ternary Operator', 'document.write', 'PHP', 'Echo', 'Dollar Sign ($)'
];

const THEMES = {
  meme: { accent: '#ff5d4f', font: 'comic', grid: 'solid' },
  dark: { accent: '#a78bfa', font: 'mono', grid: 'solid' },
  neon: { accent: '#a3f542', font: 'mono', grid: 'dashed' },
  classic: { accent: '#c83e35', font: 'serif', grid: 'solid' }
};

const card = document.querySelector('#bingoCard');
const grid = document.querySelector('#bingoGrid');
const titleInput = document.querySelector('#cardTitle');
const previewTitle = document.querySelector('#previewTitle');
const topLabelInput = document.querySelector('#topLabel');
const cornerMarkInput = document.querySelector('#cornerMark');
const titleAlignmentInput = document.querySelector('#titleAlignment');
const titleSizeInput = document.querySelector('#titleSize');
const topLabelSizeInput = document.querySelector('#topLabelSize');
const headlineColorInput = document.querySelector('#headlineColor');
const headlineOutlineColorInput = document.querySelector('#headlineOutlineColor');
const headlineOutlineWidthInput = document.querySelector('#headlineOutlineWidth');
const previewTopLabel = document.querySelector('#previewTopLabel');
const previewCornerMark = document.querySelector('#previewCornerMark');
const cardHeader = document.querySelector('#cardHeader');
const headerBackgroundInput = document.querySelector('#headerBackground');
const letterColorInputs = ['B', 'I', 'N', 'G', 'O'].map((letter) => document.querySelector(`#letterColor${letter}`));
const bingoLetterCells = [...document.querySelectorAll('.bingo-letters span')];
const letterOutlineStyleInput = document.querySelector('#letterOutlineStyle');
const letterOutlineColorInput = document.querySelector('#letterOutlineColor');
const letterFontInput = document.querySelector('#letterFont');
const themeSelect = document.querySelector('#themeSelect');
const accentInput = document.querySelector('#accentColor');
const fontSelect = document.querySelector('#fontSelect');
const gridSelect = document.querySelector('#gridStyle');
const paperSize = document.querySelector('#paperSize');
const boxOpacityInput = document.querySelector('#boxOpacity');
const photoInput = document.querySelector('#photoUpload');
const photoLayer = document.querySelector('.photo-layer');
const removePhotoButton = document.querySelector('#removePhoto');
const freeSpaceInput = document.querySelector('#freeSpaceUpload');
const removeFreeSpacePhotoButton = document.querySelector('#removeFreeSpacePhoto');
const freeSpaceOpacityInput = document.querySelector('#freeSpaceOpacity');
const designLayer = document.querySelector('#designLayer');
const stickerSizeInput = document.querySelector('#stickerSize');
const stickerRotationInput = document.querySelector('#stickerRotation');
const stickerBorderInput = document.querySelector('#stickerBorder');
const stickerBackgroundInput = document.querySelector('#stickerBackground');
const stickerNoBackgroundInput = document.querySelector('#stickerNoBackground');
const stickerTextColorInput = document.querySelector('#stickerTextColor');
const stickerBorderColorInput = document.querySelector('#stickerBorderColor');
const deleteStickerButton = document.querySelector('#deleteSticker');
const stickerTextInput = document.querySelector('#stickerText');
const opacityInput = document.querySelector('#photoOpacity');
const blurInput = document.querySelector('#photoBlur');
const photoXInput = document.querySelector('#photoX');
const photoYInput = document.querySelector('#photoY');
let photoUrl = '';
let freeSpacePhotoUrl = '';
let freeSpaceText = 'FREE SPACE';
let selectedSticker = null;
let stickerCount = 0;
const bingoLetterColorCustomized = [false, false, false, false, false];
let stickerBackgroundCustomized = false;
let stickerBackgroundTransparent = false;
let stickerTextColorCustomized = false;
let stickerBorderColorCustomized = false;

function shuffledCopy(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function makeCell(term, index) {
  const cell = document.createElement('div');
  cell.className = 'bingo-cell';
  cell.setAttribute('role', 'gridcell');
  cell.setAttribute('aria-label', `Bingo square ${index + 1}: ${term}`);
  cell.dataset.originalTerm = term;
  cell.textContent = term;
  cell.contentEditable = 'true';
  cell.spellcheck = false;
  cell.setAttribute('aria-multiline', 'false');
  cell.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      cell.blur();
    }
  });
  cell.addEventListener('input', () => {
    cell.setAttribute('aria-label', `Bingo square ${index + 1}: ${cell.innerText.trim() || 'empty'}`);
  });
  return cell;
}

function renderCard() {
  // Pick 24 distinct terms, then reserve the exact middle slot for FREE SPACE.
  const terms = shuffledCopy(VOCABULARY).slice(0, 24);
  const cells = document.createDocumentFragment();
  let termIndex = 0;

  for (let position = 0; position < 25; position += 1) {
    if (position === 12) {
      const freeCell = document.createElement('div');
      freeCell.className = 'bingo-cell free-cell';
      freeCell.setAttribute('role', 'gridcell');
      freeCell.setAttribute('aria-label', 'Free space, center square');
      freeCell.contentEditable = 'false';
      freeCell.innerHTML = '<span class="free-photo-layer" aria-hidden="true"></span><span class="free-spark" aria-hidden="true">✳</span><span class="free-label">FREE SPACE</span>';
      const freeLabel = freeCell.querySelector('.free-label');
      freeLabel.contentEditable = 'true';
      freeLabel.spellcheck = false;
      freeLabel.setAttribute('aria-label', 'Editable Free Space text');
      freeLabel.textContent = freeSpaceText;
      freeLabel.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          freeLabel.blur();
        }
      });
      freeLabel.addEventListener('input', () => {
        freeSpaceText = freeLabel.innerText.replace(/[\r\n]+/g, ' ').trim();
        if (freeLabel.textContent !== freeSpaceText) freeLabel.textContent = freeSpaceText;
        freeCell.setAttribute('aria-label', `Free space, center square: ${freeSpaceText || 'blank'}`);
      });
      cells.append(freeCell);
    } else {
      cells.append(makeCell(terms[termIndex], position));
      termIndex += 1;
    }
  }
  grid.replaceChildren(cells);
  updateFreeSpacePhoto();
}

function updateTitle() {
  previewTitle.textContent = titleInput.value.trim() || 'MY BINGO CARD';
}

function updateHeaderDesign() {
  previewTopLabel.textContent = topLabelInput.value.trim();
  previewTopLabel.hidden = !previewTopLabel.textContent;
  previewCornerMark.textContent = cornerMarkInput.value.trim();
  previewCornerMark.hidden = !previewCornerMark.textContent;
  previewTitle.style.textAlign = titleAlignmentInput.value;

  const scale = Number(titleSizeInput.value) / 100;
  const isMobile = window.matchMedia('(max-width: 700px)').matches;
  const isSmallMobile = window.matchMedia('(max-width: 420px)').matches;
  const minimum = (isMobile ? 21 : 20) * scale;
  const fluid = (isMobile ? 5.5 : 3.2) * scale;
  const maximum = (isMobile ? 35 : 39) * scale;
  previewTitle.style.fontSize = `clamp(${minimum}px, ${fluid}vw, ${maximum}px)`;
  document.querySelector('#titleSizeValue').value = `${titleSizeInput.value}%`;

  const labelScale = Number(topLabelSizeInput.value) / 100;
  const labelMaximum = (isSmallMobile ? 6 : isMobile ? 7 : 9) * labelScale;
  const labelFluid = (isMobile ? 1.4 : .74) * labelScale;
  previewTopLabel.style.fontSize = `clamp(${6 * labelScale}px, ${labelFluid}vw, ${labelMaximum}px)`;
  document.querySelector('#topLabelSizeValue').value = `${topLabelSizeInput.value}%`;
}

function updateHeadlineStyleLabels() {
  document.querySelector('#headlineColorHex').textContent = headlineColorInput.value.toUpperCase();
  document.querySelector('#headlineOutlineHex').textContent = headlineOutlineColorInput.value.toUpperCase();
  document.querySelector('#headlineOutlineWidthValue').value = `${headlineOutlineWidthInput.value} px`;
}

function updateHeadlineStyle() {
  const outlineWidth = Number(headlineOutlineWidthInput.value);
  previewTitle.style.color = headlineColorInput.value;
  previewTitle.style.webkitTextStroke = outlineWidth > 0
    ? `${outlineWidth}px ${headlineOutlineColorInput.value}`
    : '0 transparent';
  updateHeadlineStyleLabels();
}

function resetHeadlineStyle() {
  previewTitle.style.removeProperty('color');
  previewTitle.style.removeProperty('-webkit-text-stroke');
  headlineColorInput.value = colorToHex(getComputedStyle(previewTitle).color);
  headlineOutlineColorInput.value = accentInput.value;
  headlineOutlineWidthInput.value = '0';
  updateHeadlineStyleLabels();
}

function colorToHex(color) {
  const channels = color.match(/\d+/g);
  if (!channels || channels.length < 3) return '#25231f';
  return `#${channels.slice(0, 3).map((channel) => Number(channel).toString(16).padStart(2, '0')).join('')}`;
}

function updateAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-ink', getReadableTextColor(color));
  card.style.setProperty('--card-accent', color);
  card.style.setProperty('--accent-ink', getReadableTextColor(color));
  document.querySelector('#accentHex').textContent = color.toUpperCase();
  updateBingoLetterColors();
}

function getReadableTextColor(hex) {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16) / 255;
  const green = parseInt(value.slice(2, 4), 16) / 255;
  const blue = parseInt(value.slice(4, 6), 16) / 255;
  const linearize = (channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  const luminance = 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
  return luminance > 0.42 ? '#20231d' : '#ffffff';
}

function updateBingoLetterColors() {
  const accent = getComputedStyle(card).getPropertyValue('--card-accent').trim() || '#ff5d4f';
  letterColorInputs.forEach((input, index) => {
    const color = bingoLetterColorCustomized[index] ? input.value : accent;
    if (!bingoLetterColorCustomized[index]) input.value = accent;
    const letter = bingoLetterCells[index];
    letter.style.backgroundColor = bingoLetterColorCustomized[index] ? color : '';
    letter.style.color = getReadableTextColor(color);
  });
}

function updateBingoLetterStyles() {
  const outlineStyle = letterOutlineStyleInput.value;
  const outlineColor = letterOutlineColorInput.value;
  const fontFamilies = {
    comic: "'Space Grotesk', 'DM Sans', sans-serif",
    clean: "'DM Sans', sans-serif",
    mono: "'DM Mono', monospace",
    serif: "Georgia, 'Times New Roman', serif",
    marker: "'Permanent Marker', cursive",
    display: "'Bungee', sans-serif",
    condensed: "'Oswald', sans-serif",
    editorial: "'Lora', Georgia, serif"
  };

  bingoLetterCells.forEach((letter) => {
    letter.style.borderStyle = outlineStyle;
    letter.style.borderWidth = outlineStyle === 'double' ? '3px' : '2px';
    letter.style.borderColor = outlineColor;
    letter.style.fontFamily = fontFamilies[letterFontInput.value] || '';
  });
  document.querySelector('#letterOutlineHex').textContent = outlineColor.toUpperCase();
}

function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.meme;
  card.classList.remove('theme-meme', 'theme-dark', 'theme-neon', 'theme-classic');
  card.classList.add(`theme-${themeName}`);
  accentInput.value = theme.accent;
  fontSelect.value = theme.font;
  gridSelect.value = theme.grid;
  updateAccent(theme.accent);
  updateCardStyle();
}

function updateCardStyle() {
  card.classList.remove('font-comic', 'font-clean', 'font-mono', 'font-serif', 'font-marker', 'font-display', 'font-condensed', 'font-editorial');
  card.classList.add(`font-${fontSelect.value}`);
  card.classList.remove('grid-solid', 'grid-dashed', 'grid-rounded', 'grid-double');
  card.classList.add(`grid-${gridSelect.value}`);
  card.classList.remove('size-letter', 'size-square', 'size-8x11');
  const cardSizeClass = { letter: 'size-letter', square: 'size-square', '8x11': 'size-8x11' }[paperSize.value] || 'size-letter';
  card.classList.add(cardSizeClass);
  updateBoxOpacity();
}

function updateBoxOpacity() {
  const opacity = Number(boxOpacityInput.value);
  card.style.setProperty('--box-opacity', `${opacity}%`);
  document.querySelector('#boxOpacityValue').value = `${opacity}%`;
}

function updatePhotoControls() {
  const opacity = Number(opacityInput.value);
  const blur = Number(blurInput.value);
  photoLayer.style.opacity = String(opacity / 100);
  photoLayer.style.filter = `blur(${blur}px)`;
  photoLayer.style.backgroundPosition = `${photoXInput.value}% ${photoYInput.value}%`;
  document.querySelector('#opacityValue').value = `${opacity}%`;
  document.querySelector('#blurValue').value = `${blur} px`;
  document.querySelector('#photoXValue').value = `${photoXInput.value}%`;
  document.querySelector('#photoYValue').value = `${photoYInput.value}%`;
}

function clearPhoto() {
  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = '';
  photoLayer.style.backgroundImage = 'none';
  photoLayer.style.opacity = '0';
  photoInput.value = '';
  removePhotoButton.hidden = true;
}

function updateFreeSpacePhoto() {
  const freePhotoLayer = grid.querySelector('.free-photo-layer');
  if (!freePhotoLayer) return;
  freePhotoLayer.parentElement.classList.toggle('has-photo', Boolean(freeSpacePhotoUrl));
  freePhotoLayer.style.backgroundImage = freeSpacePhotoUrl ? `url("${freeSpacePhotoUrl}")` : 'none';
  freePhotoLayer.style.opacity = String(Number(freeSpaceOpacityInput.value) / 100);
  document.querySelector('#freeSpaceOpacityValue').value = `${freeSpaceOpacityInput.value}%`;
}

function clearFreeSpacePhoto() {
  if (freeSpacePhotoUrl) URL.revokeObjectURL(freeSpacePhotoUrl);
  freeSpacePhotoUrl = '';
  freeSpaceInput.value = '';
  removeFreeSpacePhotoButton.hidden = true;
  updateFreeSpacePhoto();
}

function updateStickerSize(sticker, size) {
  const type = sticker.dataset.type;
  sticker.dataset.size = String(size);
  sticker.style.setProperty('--sticker-size', `${type === 'caption' ? Math.max(12, Math.round(size * 0.36)) : size}px`);
}

function updateStickerRotation(sticker, rotation) {
  const angle = Math.max(-180, Math.min(180, Number(rotation)));
  sticker.dataset.rotation = String(angle);
  sticker.style.setProperty('--sticker-rotation', `${angle}deg`);
  document.querySelector('#stickerRotationValue').value = `${angle}°`;
}

function updateStickerBorder(sticker, style) {
  sticker.classList.remove('sticker-border-default', 'sticker-border-bold', 'sticker-border-accent', 'sticker-border-white', 'sticker-border-none');
  sticker.classList.add(`sticker-border-${style}`);
  sticker.dataset.border = style;
  if (!stickerBorderColorCustomized) sticker.dataset.borderColor = getDefaultStickerBorderColor(style);
}

function getDefaultStickerBorderColor(style) {
  if (style === 'accent') return getComputedStyle(card).getPropertyValue('--card-accent').trim();
  if (style === 'white') return '#ffffff';
  return '#25231f';
}

function updateStickerColors(sticker, background, textColor, borderColor) {
  sticker.dataset.background = background;
  sticker.dataset.backgroundTransparent = String(stickerBackgroundTransparent);
  sticker.dataset.textColor = textColor;
  sticker.dataset.borderColor = borderColor;
  sticker.dataset.backgroundCustomized = String(stickerBackgroundCustomized);
  sticker.dataset.textColorCustomized = String(stickerTextColorCustomized);
  sticker.dataset.borderColorCustomized = String(stickerBorderColorCustomized);
  if (stickerBackgroundTransparent) sticker.style.setProperty('--sticker-background', 'transparent');
  else if (stickerBackgroundCustomized) sticker.style.setProperty('--sticker-background', background);
  else sticker.style.removeProperty('--sticker-background');
  if (stickerTextColorCustomized) sticker.style.setProperty('--sticker-text-color', textColor);
  else sticker.style.removeProperty('--sticker-text-color');
  if (stickerBorderColorCustomized) sticker.style.setProperty('--sticker-border-color', borderColor);
  else sticker.style.removeProperty('--sticker-border-color');
}

function updateStickerColorLabels() {
  document.querySelector('#stickerBackgroundHex').textContent = stickerBackgroundInput.value.toUpperCase();
  document.querySelector('#stickerTextHex').textContent = stickerTextColorInput.value.toUpperCase();
  document.querySelector('#stickerBorderHex').textContent = stickerBorderColorInput.value.toUpperCase();
}

function selectSticker(sticker) {
  designLayer.querySelectorAll('.design-sticker.is-selected').forEach((item) => item.classList.remove('is-selected'));
  selectedSticker = sticker;
  if (sticker) {
    sticker.classList.add('is-selected');
    stickerSizeInput.disabled = false;
    stickerRotationInput.disabled = false;
    deleteStickerButton.disabled = false;
    stickerSizeInput.value = sticker.dataset.size || '46';
    updateStickerRotation(sticker, sticker.dataset.rotation || 0);
    stickerBorderInput.value = sticker.dataset.border || 'default';
    stickerBackgroundInput.value = sticker.dataset.background || '#ffffff';
    stickerBackgroundTransparent = sticker.dataset.backgroundTransparent === 'true';
    stickerNoBackgroundInput.checked = stickerBackgroundTransparent;
    stickerBackgroundInput.disabled = stickerBackgroundTransparent;
    stickerTextColorInput.value = sticker.dataset.textColor || '#25231f';
    stickerBorderColorInput.value = sticker.dataset.borderColor || '#25231f';
    stickerBackgroundCustomized = sticker.dataset.backgroundCustomized === 'true';
    stickerTextColorCustomized = sticker.dataset.textColorCustomized === 'true';
    stickerBorderColorCustomized = sticker.dataset.borderColorCustomized === 'true';
    updateStickerColorLabels();
    const isCaption = sticker.dataset.type === 'caption';
    stickerTextInput.disabled = !isCaption;
    stickerTextInput.value = isCaption ? sticker.textContent : '';
    stickerTextInput.placeholder = isCaption ? 'Edit this sticker caption' : 'Select a caption sticker to edit';
  } else {
    stickerSizeInput.disabled = true;
    stickerRotationInput.disabled = true;
    deleteStickerButton.disabled = true;
    stickerBackgroundInput.disabled = stickerBackgroundTransparent;
    stickerTextInput.disabled = true;
    stickerTextInput.value = '';
    stickerTextInput.placeholder = 'Select a caption sticker to edit';
  }
}

function createSticker(value, x = 50, y = 50) {
  if (!value) return;
  const isCaption = value.startsWith('caption:');
  let text = isCaption ? value.slice(8) : value;
  const sticker = document.createElement('span');
  sticker.className = `design-sticker${isCaption ? ' caption-sticker' : ''}`;
  updateStickerBorder(sticker, stickerBorderInput.value);
  const background = stickerBackgroundCustomized ? stickerBackgroundInput.value : (isCaption ? '#ffe871' : '#ffffff');
  const textColor = stickerTextColorCustomized ? stickerTextColorInput.value : '#25231f';
  const borderColor = stickerBorderColorCustomized ? stickerBorderColorInput.value : getDefaultStickerBorderColor(stickerBorderInput.value);
  updateStickerColors(sticker, background, textColor, borderColor);
  sticker.textContent = text;
  sticker.dataset.type = isCaption ? 'caption' : 'emoji';
  sticker.dataset.x = String(x);
  sticker.dataset.y = String(y);
  sticker.setAttribute('role', 'button');
  sticker.setAttribute('aria-label', isCaption ? `Caption sticker: ${text}. Drag to move; edit it in the Selected caption field.` : `${text} sticker. Drag to move.`);
  sticker.setAttribute('tabindex', '0');
  const initialSize = 46;
  updateStickerSize(sticker, initialSize);
  sticker.style.setProperty('--sticker-x', `${x}%`);
  sticker.style.setProperty('--sticker-y', `${y}%`);
  const initialRotation = Math.round((stickerCount++ % 2 ? 1 : -1) * (4 + Math.random() * 6));
  updateStickerRotation(sticker, initialRotation);

  sticker.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    selectSticker(sticker);
    const bounds = designLayer.getBoundingClientRect();
    const centerX = Number(sticker.dataset.x) / 100 * bounds.width;
    const centerY = Number(sticker.dataset.y) / 100 * bounds.height;
    const offsetX = event.clientX - bounds.left - centerX;
    const offsetY = event.clientY - bounds.top - centerY;
    sticker.setPointerCapture(event.pointerId);
    const moveSticker = (moveEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return;
      const left = Math.max(0, Math.min(bounds.width, moveEvent.clientX - bounds.left - offsetX));
      const top = Math.max(0, Math.min(bounds.height, moveEvent.clientY - bounds.top - offsetY));
      const nextX = left / bounds.width * 100;
      const nextY = top / bounds.height * 100;
      sticker.dataset.x = String(nextX);
      sticker.dataset.y = String(nextY);
      sticker.style.setProperty('--sticker-x', `${nextX}%`);
      sticker.style.setProperty('--sticker-y', `${nextY}%`);
    };
    const stopMoving = (upEvent) => {
      if (upEvent.pointerId !== event.pointerId) return;
      sticker.removeEventListener('pointermove', moveSticker);
      sticker.removeEventListener('pointerup', stopMoving);
      sticker.removeEventListener('pointercancel', stopMoving);
      if (sticker.hasPointerCapture(event.pointerId)) sticker.releasePointerCapture(event.pointerId);
    };
    sticker.addEventListener('pointermove', moveSticker);
    sticker.addEventListener('pointerup', stopMoving);
    sticker.addEventListener('pointercancel', stopMoving);
  });

  sticker.addEventListener('click', () => selectSticker(sticker));
  sticker.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectSticker(sticker);
    }
  });
  designLayer.append(sticker);
  selectSticker(sticker);
}

document.querySelectorAll('.sticker-tool[data-sticker]').forEach((tool) => {
  tool.addEventListener('click', () => createSticker(tool.dataset.sticker));
  tool.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('application/x-bingo-sticker', tool.dataset.sticker);
    event.dataTransfer.effectAllowed = 'copy';
  });
  tool.addEventListener('dragend', () => card.classList.remove('is-drop-target'));
});

card.addEventListener('dragover', (event) => {
  if (!event.dataTransfer.types.includes('application/x-bingo-sticker')) return;
  event.preventDefault();
  card.classList.add('is-drop-target');
});
card.addEventListener('dragleave', (event) => {
  if (!card.contains(event.relatedTarget)) card.classList.remove('is-drop-target');
});
card.addEventListener('drop', (event) => {
  const value = event.dataTransfer.getData('application/x-bingo-sticker');
  if (!value) return;
  event.preventDefault();
  const bounds = designLayer.getBoundingClientRect();
  const x = Math.max(4, Math.min(96, (event.clientX - bounds.left) / bounds.width * 100));
  const y = Math.max(4, Math.min(96, (event.clientY - bounds.top) / bounds.height * 100));
  card.classList.remove('is-drop-target');
  createSticker(value, x, y);
});

document.querySelector('#addCaption').addEventListener('click', () => createSticker('caption:YOUR TEXT'));
stickerSizeInput.addEventListener('input', () => {
  if (selectedSticker) updateStickerSize(selectedSticker, Number(stickerSizeInput.value));
});
stickerRotationInput.addEventListener('input', () => {
  if (selectedSticker) updateStickerRotation(selectedSticker, stickerRotationInput.value);
});
stickerBorderInput.addEventListener('change', () => {
  if (!selectedSticker) return;
  updateStickerBorder(selectedSticker, stickerBorderInput.value);
  if (!stickerBorderColorCustomized) {
    stickerBorderColorInput.value = selectedSticker.dataset.borderColor;
    updateStickerColorLabels();
  }
});
function handleStickerColorChange(event) {
  if (event.currentTarget === stickerBackgroundInput) {
    stickerBackgroundCustomized = true;
    stickerBackgroundTransparent = false;
    stickerNoBackgroundInput.checked = false;
    stickerBackgroundInput.disabled = false;
  }
  if (event.currentTarget === stickerTextColorInput) stickerTextColorCustomized = true;
  if (event.currentTarget === stickerBorderColorInput) stickerBorderColorCustomized = true;
  updateStickerColorLabels();
  if (selectedSticker) {
    updateStickerColors(selectedSticker, stickerBackgroundInput.value, stickerTextColorInput.value, stickerBorderColorInput.value);
  }
}
[stickerBackgroundInput, stickerTextColorInput, stickerBorderColorInput].forEach((input) => {
  input.addEventListener('input', handleStickerColorChange);
});
stickerNoBackgroundInput.addEventListener('change', () => {
  stickerBackgroundTransparent = stickerNoBackgroundInput.checked;
  stickerBackgroundInput.disabled = stickerBackgroundTransparent;
  if (selectedSticker) {
    updateStickerColors(selectedSticker, stickerBackgroundInput.value, stickerTextColorInput.value, stickerBorderColorInput.value);
  }
});
stickerTextInput.addEventListener('input', () => {
  if (!selectedSticker || selectedSticker.dataset.type !== 'caption') return;
  selectedSticker.textContent = stickerTextInput.value;
  selectedSticker.setAttribute('aria-label', `Caption sticker: ${selectedSticker.textContent || 'blank'}. Drag to move.`);
});
deleteStickerButton.addEventListener('click', () => {
  if (!selectedSticker) return;
  selectedSticker.remove();
  selectSticker(null);
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Delete' && event.key !== 'Backspace') return;
  if (!selectedSticker || document.activeElement?.isContentEditable) return;
  selectedSticker.remove();
  selectSticker(null);
});
designLayer.addEventListener('pointerdown', (event) => {
  if (event.target === designLayer) selectSticker(null);
});

document.querySelectorAll('.editable-footer').forEach((label) => {
  label.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    label.blur();
  });
  label.addEventListener('input', () => {
    const text = label.innerText.trim();
    label.setAttribute('aria-label', `Editable card footer text: ${text || 'blank'}`);
  });
});

titleInput.addEventListener('input', updateTitle);
topLabelInput.addEventListener('input', updateHeaderDesign);
cornerMarkInput.addEventListener('input', updateHeaderDesign);
titleAlignmentInput.addEventListener('change', updateHeaderDesign);
titleSizeInput.addEventListener('input', updateHeaderDesign);
topLabelSizeInput.addEventListener('input', updateHeaderDesign);
window.addEventListener('resize', updateHeaderDesign);
headlineColorInput.addEventListener('input', updateHeadlineStyle);
headlineOutlineColorInput.addEventListener('input', updateHeadlineStyle);
headlineOutlineWidthInput.addEventListener('input', updateHeadlineStyle);
document.querySelector('#resetHeadlineStyle').addEventListener('click', resetHeadlineStyle);
themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));
accentInput.addEventListener('input', () => updateAccent(accentInput.value));
fontSelect.addEventListener('change', updateCardStyle);
gridSelect.addEventListener('change', updateCardStyle);
paperSize.addEventListener('change', updateCardStyle);
boxOpacityInput.addEventListener('input', updateBoxOpacity);
headerBackgroundInput.addEventListener('input', () => {
  cardHeader.style.backgroundColor = headerBackgroundInput.value;
  document.querySelector('#headerBackgroundHex').textContent = headerBackgroundInput.value.toUpperCase();
});
document.querySelector('#clearHeaderBackground').addEventListener('click', () => {
  cardHeader.style.removeProperty('background-color');
  headerBackgroundInput.value = '#fffdf8';
  document.querySelector('#headerBackgroundHex').textContent = 'AUTO';
});
letterColorInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    bingoLetterColorCustomized[index] = true;
    updateBingoLetterColors();
  });
});
letterOutlineStyleInput.addEventListener('change', updateBingoLetterStyles);
letterOutlineColorInput.addEventListener('input', updateBingoLetterStyles);
letterFontInput.addEventListener('change', updateBingoLetterStyles);

[opacityInput, blurInput, photoXInput, photoYInput].forEach((control) => {
  control.addEventListener('input', updatePhotoControls);
});

photoInput.addEventListener('change', () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    window.alert('Please choose an image file.');
    photoInput.value = '';
    return;
  }
  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = URL.createObjectURL(file);
  photoLayer.style.backgroundImage = `url("${photoUrl}")`;
  photoLayer.style.opacity = String(Number(opacityInput.value) / 100);
  removePhotoButton.hidden = false;
});

removePhotoButton.addEventListener('click', clearPhoto);
freeSpaceInput.addEventListener('change', () => {
  const file = freeSpaceInput.files && freeSpaceInput.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    window.alert('Please choose an image file.');
    freeSpaceInput.value = '';
    return;
  }
  if (freeSpacePhotoUrl) URL.revokeObjectURL(freeSpacePhotoUrl);
  freeSpacePhotoUrl = URL.createObjectURL(file);
  removeFreeSpacePhotoButton.hidden = false;
  updateFreeSpacePhoto();
});
freeSpaceOpacityInput.addEventListener('input', updateFreeSpacePhoto);
removeFreeSpacePhotoButton.addEventListener('click', clearFreeSpacePhoto);
document.querySelector('#shuffleButton').addEventListener('click', renderCard);
document.querySelector('#printButton').addEventListener('click', () => window.print());

renderCard();
updateTitle();
updateHeaderDesign();
updateHeadlineStyleLabels();
updateAccent(accentInput.value);
updateBingoLetterStyles();
updatePhotoControls();
updateCardStyle();
updateBoxOpacity();
