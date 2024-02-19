export async function fuzzHypedditDownload(document: Document) {
  console.log('entered');
  const url = 'https://hypeddit.com/gate/download/ul';
  const fileId = (
    document.querySelector('#current_download_file_listner') as HTMLInputElement
  ).value;

  injectScript(chrome.runtime.getURL('injectedScript.js'), document.body);
  const jsonGateData = await listenForInjectedScriptResponse();
  // @ts-ignore
  const externalId = jsonGateData.externID;

  const testData = {
    file: fileId,
    download_visit: 'true',
    profile_downloads: 'true',
    time: '92721',
    sc_comment_text: 'fire',
    page: 'nonsingle',
    'additional_sc_user_id[]': '17799211',
    is_skippable: '0',
    steps: 'email,sc,ig',
    email: 'expone1@gmail.com',
    download_action: 'DOWNLOAD',
    'skip_gate_steps[]': 'ig',
    wrndk: '1322582x6776414',
    is_mobile: '',
    external_id: externalId,
    hypesource: '',
    adcode: '',
  };

  const formData = new URLSearchParams();
  Object.entries(testData).forEach(([key, value]) =>
    formData.append(key, value),
  );
  console.log(...formData);

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formData,
  };

  const response = await fetch(url, requestOptions).then((response) =>
    response.json(),
  );
  console.log(response);
}

async function listenForInjectedScriptResponse() {
  let listener: EventListener;
  let eventData = null;

  return new Promise((resolve, reject) => {
    listener = (event) => {
      console.log('received event', event);
      eventData = (event as CustomEvent).detail.data;
      document.removeEventListener('Extracted_data', listener);
      resolve(eventData);
    };

    document.addEventListener('Extracted_data', listener);
  });
}

function injectScript(file: string, container: HTMLElement) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file);
  container.appendChild(script);
}
