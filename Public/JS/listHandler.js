//Board ID
const id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

//LIST OPERATIONS
$(".js-create-list").focus(function() {
    $('.add-list .fa-plus').hide();
    $(this).removeClass('pl-10');
    $(this).addClass('pl-4');
    $('.add-list').addClass('h-28 rounded bg-gray-100 w-68');
    $('.js-add-list-button').removeClass('hidden');
});

$(".js-create-list").blur(function() {
    setTimeout(() => {
        $('.js-add-list-button').addClass('hidden');
    }, 100);
    $('.add-list .fa-plus').show();
    $(this).addClass('pl-10');
    $(this).removeClass('pl-4');
    $('.add-list').removeClass('h-28 rounded bg-gray-100 w-68');
});


$(".js-add-list-button").on("click", function() {
    let listName = $(this).siblings('input').val();
    addList(listName);
    $(this).siblings('input').val('');
});

$(".js-create-list").on("keypress", function(e) {
    let listName = $(this).val();
    if (e.keyCode == 13) {
        addList(listName);
        e.preventDefault();
        $(this).val('');
    }
});

async function addList(listName) {
    if (!listName)
        listName = " ";
    try {
        const res = await fetch('add-list', {
            method: 'POST',
            body: JSON.stringify({ id, header: listName }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        let listID = data.doc.lists[data.doc.lists.length - 1]._id;
        $('.lists .add-list').before(`<div id="${listID}" class="list  mx-4 relative w-64 bg-gray-200 rounded ">
    <div class="header flex justify-between p-3 text-color">
        <h1 class="font-bold text-xl mb-2">${listName}</h1>
        <i class="fas fa-ellipsis-h cursor-pointer hover:bg-gray-300 px-1 h-5 rounded"></i>
    </div>
    <div class="body">
        <ul>
        </ul>
        <div class="add-card relative">
            <i class="fas fa-plus text-gray-600  absolute"></i>
            <textarea oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' class="block js-create-card bg-gray-200 appearance-none  rounded  pt-2  pl-8 text-gray-700 leading-tight focus:outline-none mx-auto resize-none" type="text" placeholder="Add a list"></textarea>
            <button class="js-add-card-button mb-2 hidden bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4  mx-2 mt-2 rounded"> Add list</button>
        </div>
    </div>
</div>`)
    } catch (error) {
        console.log(error);
    }
}


//CARD OPERATIONS
let lastList;

$(document).on('focus', '.js-create-card', function(e) {
    $(this).siblings('.add-card .fa-plus').hide();
    $(this).removeClass('pl-8 bg-gray-200');
    $(this).addClass('h-20 px-4 w-60 resize bg-white');
    $(this).siblings('.js-add-card-button').removeClass('hidden');
    lastList = $(this).parent().parent().parent().attr('id');
});

$(document).click(function(e) {
    var target = e.target;
    var lastElement = '#' + lastList;

    if (!$(target).is(lastElement) && !$(target).parent().parent().is(lastElement) && !$(target).parent().parent().parent().is(lastElement)) {
        $('.add-card .fa-plus').show();
        $(lastElement).children().children().children('textarea').addClass('pl-8 bg-gray-200');
        $(lastElement).children().children().children('textarea').removeClass('h-20 px-4 w-60 resize bg-white');
        $('.js-add-card-button').addClass('hidden')
    }
});

$(document).on('click', '.js-add-card-button', function(e) {
    let text = $(this).siblings('textarea').val();
    let id = $(this).parent().parent().parent().attr('id');
    addCard(id, text);
    $(this).siblings('textarea').val('');
});

$(document).on('keypress', '.js-create-card', function(e) {
    let text = $(this).val();
    let id = $(this).parent().parent().parent().attr('id');
    if (e.keyCode == 13) {
        addCard(id, text);
        e.preventDefault();
        $(this).val('');
    }
});

async function addCard(listID, text) {
    if (!text)
        text = " ";


    try {
        const res = await fetch('add-list-item', {
            method: 'POST',
            body: JSON.stringify({ id, listID, listItem: text }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(data);
        $('#' + listID + ' ul ').append(`<li class="bg-white rounded h-8 mx-auto my-2 px-2 py-1">${text}</li>`);
    } catch (error) {
        console.log(error);
    }


}


//