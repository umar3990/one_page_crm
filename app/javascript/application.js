// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"
document.addEventListener("turbo:load", function () {
    const field1 = document.getElementById('a');
    const field2 = document.getElementById('b');
    const button1 = document.getElementById('sum-button');
    const button2 = document.getElementById('difference-button');
    const button3 = document.getElementById('multiplication-button');
    const button4 = document.getElementById('division-button');
    const form = document.getElementById("calculator-form");
    const inputs = form.getElementsByTagName("input");
    const buttons = form.getElementsByTagName("button");
    const loader = document.getElementById("loader");
    const result = document.getElementById("result");

    const OPERATIONS = Object.freeze({
        sum: '+',
        difference: '-',
        multiplication: '*',
        division: '/',
    });

    field1.addEventListener('input', checkFields);
    field2.addEventListener('input', checkFields);
    button1.addEventListener('click', calculate);
    button2.addEventListener('click', calculate);
    button3.addEventListener('click', calculate);
    button4.addEventListener('click', calculate);

    function checkFields() {
        if (field1.value < 0 || field1.value >= 100 || field2.value < 0 || field2.value >= 100) {
            button1.disabled = true;
            button2.disabled = true;
            button3.disabled = true;
            button4.disabled = true;
        } else {
            button1.disabled = false;
            button2.disabled = false;
            button3.disabled = false;
            button4.disabled = false;
        }
    }

    function calculate() {
        const a = field1.value;
        const b = field2.value;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const url= "/calculator/calculation"

        loader.style.display = "block";
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
                'Accept': 'application/javascript'
            },
            body: JSON.stringify({  a: a, b: b, operator: `${this.value}` })
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(error => {
                    throw new Error(error.error);
                });
            }
        }).then(data => {
            const text = `Operation: ${data.a} ${OPERATIONS[data.operator]} ${data.b}\n Result: ${data.result}\n ID: ${data.id}\n Count: ${data.query_count}`;

            result.style.color="green";
            result.value = text;

            loader.style.display = "none";
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = false;
            }
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].disabled = false;
            }
        })
            .catch(error => {
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = false;
                }
                loader.style.display = "none";
                result.style.color="red";
                result.value = error;
            });
    }
})
