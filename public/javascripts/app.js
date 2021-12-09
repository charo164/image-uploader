const input = document.querySelector('#uploaderInput');
const loaderContainer = document.querySelector('.loaderContainer');
const dropbox = document.querySelector('.dropbox');
const copy = document.querySelector('#copy');
const image = document.querySelector('.img img')

dropbox?.addEventListener('dragover', preventDefault);
dropbox?.addEventListener('dragenter', preventDefault);
dropbox?.addEventListener('drop', (e) => {
  e.preventDefault();
  handleSubmit(e.dataTransfer?.files);
});

input?.addEventListener('change', (e) => {
  handleSubmit(e.target?.files);
});

copy?.addEventListener('click', () => {
  copyImgLink(image);
});

function handleSubmit(files) {
  toggleLoader();
  if (files.length === 0) {
    return toggleLoader();
  }
  for (var i = 0; i < 1; i++) {
    const file = files[i];
    const imageType = /^image\//;
    if (!imageType.test(file.type)) {
      toggleLoader();
      Alert(`Invalid file: ${file.type}`, 'error');
      continue;
    }
    //Preview
    const img = document.createElement('img');
    const preview = document.querySelector('.dropbox');
    preview.innerHTML = '';
    preview.appendChild(img);
    var reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);

    //Upload
    const data = new FormData();
    data.append('file', file, file.name);
    fetch('/uploads', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          Alert('Uploaded Successfully!', 'success');
          setTimeout(() => {
            location.href = `/image/${res.filename}`;
          }, 500);
        } else Alert('Error', 'error');
        toggleLoader();
      })
      .catch((error) => {
        Alert('Error', 'error');
        toggleLoader();
      });
  }
}

function preventDefault(e) {
  e.stopPropagation();
  e.preventDefault();
}

const alertTheme = {
  default: {
    color: '#3461dc',
    bg: '#dbeafe',
    icon: '<svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
  },
  success: {
    color: '#047857',
    bg: '#d1fae5',
    icon: '<svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
  },
  error: {
    color: '#b91c1c',
    bg: '#fee2e2',
    icon: '<svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
  },
};

/**
 *
 * @param {string} msg
 * @param {'default'|'success'|'error'} type
 */
function Alert(msg, type = 'default') {
  const popup = document.createElement('span');
  const container = document.querySelector('.container');
  popup.classList.add('popup');
  popup.innerHTML = `${alertTheme[type].icon} ${msg}`;
  popup.style.setProperty('color', alertTheme[type].color);
  popup.style.setProperty('background-color', alertTheme[type].bg);
  container.appendChild(popup);
  popup.onclick = () => popup.remove();
  setTimeout(() => {
    popup.remove();
  }, 7000);
}

function copyImgLink(img) {
  navigator.clipboard.writeText(img.src)
  Alert('copied', 'success');
}

function toggleLoader() {
  loaderContainer?.classList.toggle('hidden');
}
