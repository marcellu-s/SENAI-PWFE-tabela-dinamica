// Funções de criação

function createElement(el) {
    return document.createElement(el);
}

function createTable() {
    const body = document.querySelector('body');
    const table = `
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Média</th>
                <th>Situação</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>1</th>
                <td><input type="text" class="form-control" placeholder="nome"></td>
                <td><input type="number" class="form-control" placeholder="---"></td>
                <td><input type="number" class="form-control" placeholder="---"></td>
                <td><output class="mean"></output></td>
                <td><output class="situation"></output></td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>Média geral</th>
                <td><output id="overall-average"></output></td>
            </tr>
        </tfoot>
    </table>`;

    const controlButtons = `
    <div class="control-buttons">
        <button id="add-row" type="button">ADD Linha</button>
        <button id="add-col" type="button">ADD Coluna</button>
        <button id="view-grades" type="button">Calcular média</button>
        <button id="order-abc" type="button">Ordenar por nome <i id="name-order" class="bi bi-caret-down"></i></button>
        <button id="order-mean" type="button">Ordenar por média <i id="mean-order" class="bi bi-caret-down"></i></button>
        <div>
            <button id="del-row" type="button">DEL Linha</button>
            <button id="del-col" type="button">DEL Coluna</button>
        </div>
    </div>`;

    body.innerHTML = table;
    body.innerHTML += controlButtons;
}

createTable();

// Funções de consultas

function arrayTrTbody() {
    return document.querySelectorAll('table tbody tr');
}

function trThead() {
    return document.querySelector('table thead tr');
}

function consultTbody() {
    return document.querySelector('table tbody');
}

function consultValues() {

    const array = consultTbody().querySelectorAll('tbody input[type=number]');
    
    for (let input of array) {
        if (input.value < 0 || input.value > 100 || input.value == '') {
            window.alert('Garanta que as notas estejam entre 0 e 100!');
            return false;
        } 
    }

    return true
}

// Funções de manipulação

function addCol() {

    const amountNotesColumn = trThead().children.length - 4;

    if (amountNotesColumn >= 6) {
        window.alert('Número máximo de colunas atingido');
        return false;
    }
    // ADD TH
    const newTh = createElement('th');
    newTh.textContent = `Nota ${amountNotesColumn + 1}`;

    const childrenThead = document.querySelector('table thead tr').children;
    let insertBeforeReference = childrenThead[childrenThead.length - 2]

    trThead().insertBefore(newTh, insertBeforeReference);
    // ADD TD
    arrayTrTbody().forEach((tr) => {

        let newTd = createElement('td');
        newTd.innerHTML = '<input type="number" class="form-control" placeholder="---">';

        let childrenTr = tr.children;
        insertBeforeReference = childrenTr[childrenTr.length - 2];

        tr.insertBefore(newTd, insertBeforeReference);
    });
}

function delCol() {

    const amountNotesColumn = document.querySelector('table thead tr').children.length - 4;

    if (amountNotesColumn <= 1) {
        window.alert('Número mínimo de colunas atingido');
        return false;
    }
    // Remove TH
    const thead = trThead();
    let children = thead.children
    thead.removeChild(children[children.length - 3]);
    // Remove TD
    arrayTrTbody().forEach((tr) => {
        children = tr.children;
        tr.removeChild(children[children.length - 3]);
    });
}

function addRow() {

    if (arrayTrTbody().length >= 10) {
        window.alert('Número máximo de linhas atingido');
        return false;
    }

    const tbody = consultTbody();
    const template = tbody.children[0];
    const newTr = template.cloneNode(true);

    const childReference = newTr.children[0];
    const newTh = createElement('th');
    newTh.textContent = `${arrayTrTbody().length + 1}`
    newTr.replaceChild(newTh, childReference);

    // Como estou fazendo uma cópia, será necessário limpar os campos do elemento clonado

    newTr.querySelectorAll('input').forEach((input) => {
        input.value = '';
    });

    newTr.querySelectorAll('output').forEach((output) => {
        output.textContent = '';
        output.style.cssText = "background-color: #fff; color: #000;"
    });

    tbody.appendChild(newTr);

}

function delRow() {

    arrayTrTbody().length <= 1 ? window.alert('Número mínimo de linhas atingido') : consultTbody().removeChild(consultTbody().lastChild);
}

function calcGrade() {

    if (!consultValues()) {
        return false;
    }

    let sumValuesGeneral = 0;
    let countValues = 0;
    
    arrayTrTbody().forEach((tr) => {

        let grades = tr.querySelectorAll('input[type=number]');
        let mean = ([...grades].reduce((sum, grade) => sum += Number(grade.value), 0)) / grades.length;
        
        sumValuesGeneral += mean;
        countValues++;

        let outputs = tr.querySelectorAll('output');

        outputs[0].textContent = mean.toFixed(1);

        if (mean >= 70) {
            outputs[1].textContent = 'APROVADO';
            outputs[1].style.cssText = "background-color: lightgreen; color: #fff;";
        } else if (mean >= 50) {
            outputs[1].textContent = 'RECUPERAÇÃO';
            outputs[1].style.cssText = "background-color: lightsalmon; color: #fff;";
        } else {
            outputs[1].textContent = 'REPROVADO';
            outputs[1].style.cssText = "background-color: lightcoral; color: #fff;";
        }

    });

    document.querySelector('#overall-average').textContent = (sumValuesGeneral / countValues).toFixed(1);
}

function sortTable(ordination, type) {
    /**
     * Ordena a tabela em ordem alfabética(nome_aluno) ou por média individual
     * @param ordination Define se a ordenação será crescente(TRUE) ou decrescente(FALSE)
     * @param type Define o tipo da ordenação por nome do aluno (abc) ou por média individual (mean)
     * @returns void
     */

    let order = ordination;
    let index = type == 'abc' ? 1 : trThead().children.length - 2;

    arr = [...arrayTrTbody()];
    
    arr.sort((a, b) => {
        let a_value = type == 'abc' ? a.children[index].children[0].value : a.children[index].textContent;
        let b_value = type == 'abc' ? b.children[index].children[0].value : b.children[index].textContent;
        return (order) ? a_value.localeCompare(b_value) : b_value.localeCompare(a_value);
    });
    arr.forEach((elem) => consultTbody().appendChild(elem));
}

// EVENTOS

const addColButton = document.querySelector('#add-col');
const delColButton = document.querySelector('#del-col');
const addRowButton = document.querySelector('#add-row');
const delRowButton = document.querySelector('#del-row');
const viewGrades = document.querySelector('#view-grades');
const orderABCButton = document.querySelector('#order-abc');
const orderMeanButton = document.querySelector('#order-mean');

addColButton.addEventListener('click', addCol);
delColButton.addEventListener('click', delCol);
addRowButton.addEventListener('click', addRow);
delRowButton.addEventListener('click', delRow);
viewGrades.addEventListener('click', calcGrade);

orderABCButton.addEventListener('click', () => {

    let icon = document.querySelector('#name-order');

    if (icon.classList.contains('bi-caret-down')) {
        icon.classList.remove('bi-caret-down');
        icon.classList.add('bi-caret-up');
        sortTable(false, 'abc');
    } else {
        icon.classList.remove('bi-caret-up');
        icon.classList.add('bi-caret-down');
        sortTable(true, 'abc');
    }
});

orderMeanButton.addEventListener('click', (e) => {

    let icon = document.querySelector('#mean-order');

    if (icon.classList.contains('bi-caret-down')) {
        icon.classList.remove('bi-caret-down');
        icon.classList.add('bi-caret-up');
        sortTable(false, 'mean');
    } else {
        icon.classList.remove('bi-caret-up');
        icon.classList.add('bi-caret-down');
        sortTable(true, 'mean');
    }
});