var CallbackRegistry = {}; // реестр

// при успехе вызовет onSuccess, при ошибке onError
export function scriptRequest(url, onSuccess, onError) {
  var scriptOk = false; // флаг, что вызов прошел успешно

  // сгенерировать имя JSONP-функции для запроса
  var callbackName = "cb" + String(Math.random()).slice(-6);

  // укажем это имя в URL запроса
  url += ~url.indexOf("?") ? "&" : "?";
  url += "callback=CallbackRegistry." + callbackName;

  // ..и создадим саму функцию в реестре
  CallbackRegistry[callbackName] = function (data) {
    scriptOk = true; // обработчик вызвался, указать что всё ок
    delete CallbackRegistry[callbackName]; // можно очистить реестр
    delete window.CallbackRegistry;
    onSuccess(data); // и вызвать onSuccess
  };

  window.CallbackRegistry = CallbackRegistry;

  // эта функция сработает при любом результате запроса
  // важно: при успешном результате - всегда после JSONP-обработчика
  function checkCallback() {
    if (scriptOk) return; // сработал обработчик?
    delete CallbackRegistry[callbackName];
    delete window.CallbackRegistry;
    onError(url); // нет - вызвать onError
  }

  var script = document.createElement("script");

  script.onload = script.onerror = checkCallback;
  script.src = url;

  document.body.appendChild(script);
}
