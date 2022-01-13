const endpoint = "https://freecurrencyapi.net/api/v2/latest";
const apiKey = "ed845a90-68da-11ec-bd5c-7d82cfc005de";
const cambio = document.querySelector(".cantidad input");
const transferencia = document.querySelector(".transferencia input");
const botonEnviar = document.querySelector(".boton1");
const inputs = document.querySelectorAll("[type='number']");
const textArea = document.querySelector("textarea");

const inputValidator = {
  transferencia: false,
};

inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let name = e.target.getAttribute("name");

    if (e.target.value.length > 0) {
      inputValidator[name] = true;
    } else {
      inputValidator[name] = false;
    }

    let allTrue = Object.keys(inputValidator).every((item) => {
      return inputValidator[item] === true;
    });

    if (allTrue) {
      botonEnviar.disabled = false;
    } else {
      botonEnviar.disabled = true;
    }
  });
});

async function getCurrency(hasta, base) {
  const response = await fetch(`${endpoint}?apikey=${apiKey}&base_currency=${base}`);
  const data = await response.json();
  return data["data"][hasta];
}

document.querySelector(".desde select").addEventListener("change", () => {
  document.querySelector(".hasta select").getElementsByTagName("option")[0].selected = "selected";
});

document.querySelector(".hasta select").addEventListener("change", () => {
  const hasta = document.querySelector(".hasta select").value;
  const base = document.querySelector(".desde select").value;
  if (base === hasta) {
    cambio.value = "";
    return null;
  } else if (hasta === "ignore") {
    return alert("Selecciona una moneda de destino");
  }
  const respuesta = getCurrency(hasta, base);
  respuesta.then((result) => {
    console.log(result);
    cambio.value = result;
  });
});

document.querySelector(".boton2").addEventListener("click", () => {
  cambio.value = "";
  textArea.value = "";
  transferencia.value = "";
  botonEnviar.disabled = true;
});

botonEnviar.addEventListener("click", () => {
  const hasta = document.querySelector(".hasta select").value;
  const base = document.querySelector(".desde select").value;
  textArea.value = "";
  textArea.value = `Перевод: ${base} -> ${hasta} по курсу ${Math.round(cambio.value * 100) / 100}\nК выдаче: ${
    Math.round(transferencia.value * cambio.value * 100) / 100
  } ${hasta}`;
});
