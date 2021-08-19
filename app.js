class Expense{
    constructor(year, month, day, type, description, importance){
        this.year = year;
        this.month = month;
        this.day = day;
        this.type = type;
        this.description = description;
        this.importance = importance;
    }

    validate(){
        for(let i in this){
            if(this[i] == undefined || this[i] == null || this[i] == '' )
            return false;
        }
        return true;
    }
}

class Bd{
    constructor(){
        let id = localStorage.getItem('id');

        if(id == null){
            localStorage.setItem('id', 0);
        }
    }

    getNextID(){
        let nextId = localStorage.getItem('id');
        return parseInt(nextId)+1;
    }

    /* Local Storage */
    save(d){
        let id = this.getNextID();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    }
    list(){
        let id = localStorage.getItem('id');
        let expenses = Array();
        for(let i=1; i <= id; i++){
            let expense = JSON.parse(localStorage.getItem(i));
            

            if(expense !== null){
                expense.id=i;
                expenses.push(expense);
            }

        }
        return expenses;
    }
    search(expense){
        let filterExpenses = Array();

        filterExpenses = this.list()

        if(expense.year != ''){
            filterExpenses = filterExpenses.filter(d => d.year == expense.year )
        }
        if(expense.month != ''){
            filterExpenses = filterExpenses.filter(d => d.month == expense.month )
        }
        if(expense.day != ''){
            filterExpenses = filterExpenses.filter(d => d.day == expense.day )
        }
        if(expense.type != ''){
            filterExpenses = filterExpenses.filter(d => d.type == expense.type )
        }
        if(expense.description != ''){
            filterExpenses = filterExpenses.filter(d => d.description == expense.description )
        }
        if(expense.importance != ''){
            filterExpenses = filterExpenses.filter(d => d.importance == expense.importance )
        }

        return filterExpenses;
    }
    remove(id){
        localStorage.removeItem(id);
        console.log("delete  id", id);
    }
}
let bd = new Bd()

function addExpense(){
    let year =document.getElementById('year');
    let month= document.getElementById('month');
    let day = document.getElementById('day');
    let type = document.getElementById('type');
    let description = document.getElementById('description');
    let importance = document.getElementById('importance');


    let expense = new Expense(
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        importance.value
    )

    if(expense.validate()){

        bd.save(expense)

        document.getElementById('modalTitleDiv').className = "modal-header text-success";
        document.getElementById('modalTitle').innerHTML = "Successfully Saved";
        document.getElementById('modalContent').innerHTML = "Expense successfully saved.";
        document.getElementById('modalButton').className = "btn btn-success";
        document.getElementById('modalButton').innerHTML = "OK";

        $('#saveModal').modal('show');
        console.log("Modal")

        year.value = '';
        month.value = '';
        day.value = '';
        type.value = '';
        description.value = '';
        importance.value = '';

        

    }else{

        document.getElementById('modalTitleDiv').className = "modal-header text-danger";
        document.getElementById('modalTitle').innerHTML = "Save Error";
        document.getElementById('modalContent').innerHTML = "There are mandatory fields that have not been filled in.";
        document.getElementById('modalButton').className = "btn btn-danger";
        document.getElementById('modalButton').innerHTML = "rectify";

        $('#saveModal').modal('show');
    }

}

function loadListExpenses(expenses = Array(), filter = false){

    if(expenses.length == 0 && filter == false){
        expenses= bd.list();
    }

    var expensesList = document.getElementById('expenseList');
    expensesList.innerHTML = '';


    console.log(expenses)
    expenses.forEach(d => {
        let line = expensesList.insertRow();

        switch(d.type){
            case '1': d.type = 'Food'; break;
            case '2': d.type = 'Education'; break;
            case '3': d.type = 'Other'; break;
            case '4': d.type = 'Health'; break;
            case '5': d.type = 'Transport'; break;
        }

        line.insertCell(0).innerHTML = `${d.day} / ${d.month} / ${d.year}`;
        line.insertCell(1).innerHTML = d.type;
        line.insertCell(2).innerHTML = d.description;
        line.insertCell(3).innerHTML = d.importance;

        console.log(d)
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_expense_${d.id}`;

        btn.onclick= function(){
            let id = this.id.replace('id_expense_', '');
            bd.remove(id);
            

            console.log("delete");
            document.getElementById('modalTitleDiv').className = "modal-header text-success";
            document.getElementById('modalTitle').innerHTML = "Successfully Deleted";
            document.getElementById('modalContent').innerHTML = "Expense successfully deleted.";
            document.getElementById('modalButton').className = "btn btn-success";
            document.getElementById('modalButton').innerHTML = "OK";
            document.getElementById('modalButton').onclick= function(){ window.location.reload()} ;
            

            $('#deleteModal').modal('show');
            //window.location.reload();
        }


        line.insertCell(4).append(btn);
       
    });

}

function searchExpense(){
    let year = document.getElementById('year').value;
    let month= document.getElementById('month').value;
    let day = document.getElementById('day').value;
    let type = document.getElementById('type').value;
    let description = document.getElementById('description').value;
    let importance = document.getElementById('importance').value;

    let expense = new Expense (year, month, day, type, description, importance);

    let expenses = bd.search(expense);
    loadListExpenses(expenses, true);

}
