const length_display = document.querySelector("[password-length]");
const slider_display = document.querySelector("[slider-length]");
const indicator = document.querySelector("[strength-indicator]");
const upper_letter = document.querySelector("#upper");
const lower_letter = document.querySelector("#lower");
const int_letter = document.querySelector("#Numbers");
const symbol_letter = document.querySelector("#Symbols");
const password_display = document.querySelector("[password-content]");
const copyMsg = document.querySelector("[data-copied]");
const copyMsg_spam = document.querySelector("[data-copy]");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector(".password_generator");

const symbols = '!@#$%^&*()-_+={}[]|\:;"<>,.?/';
let password_len = 10;
let password = "";

handle_slider();
function handle_slider(){
    length_display.innerText = password_len;
    slider_display.value = password_len;

    // not working

    // managing the half fill part until when we have to fill with background color
    // const mini = parseFloat(slider_display.min);
    // const maxi = parseFloat(slider_display.max);
    // //find the range upto which the bg will be filled
    // let range = ((password_len - mini) * 100) / (maxi - mini);
    // slider_display.style.backgroundSize = range + "%100%";
}

set_indicator("#ccc");
function set_indicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 20px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
// any random no mustbe in 0-9
function getRandomNumber(){
    return getRandomInteger(0,9);
}

function getRandomLowercase(){
    return String.fromCharCode(getRandomInteger(97,122));
}

function getRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65,90));
}

function getRandomSymbols(){
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calculate_strength(){
    let haslower = false;
    let hasupper = false;
    let hasnumber = false;
    let hassymbol = false;

    if(upper_letter.checked) hasupper = true;
    if(lower_letter.checked) haslower = true;
    if(int_letter.checked) hasnumber = true;
    if(symbol_letter.checked) hassymbol = true;

    if(haslower && hasupper && (hasnumber || hassymbol) && password_len >= 8){
        set_indicator("green");
    }
    else if( (haslower || hasupper) && (hasnumber || hassymbol) && password_len > 4){
        set_indicator("white");
    }
    else{
        set_indicator("red");
    }
}

async function copy_content(){
    try {
        await navigator.clipboard.writeText(password_display.value);
        copyMsg_spam.innerHTML = "copied";
    } 
    catch (e) {
        copyMsg_spam.innerHTML = "failed";
    }
    //if you have an active class then it will add an active class
    copyMsg_spam.classList.add("active");
    // setting a timer to remove that copy thing
    setTimeout( () => {
        copyMsg_spam.classList.remove("active");
        copyMsg_spam.innerHTML = "";
    },2000);
}

//managing slider connection with display integer
slider_display.addEventListener("input", (e) =>{
    password_len = e.target.value;
    handle_slider();
});

// if password display is empty then call copy content
copyMsg.addEventListener('click',() => {
    console.log("copied event listener called");
    if(password_display.value){
        copy_content();
    }
});

// jab bhi agar koi change ata hai checkbox me to start se 
//count karo how many check box are changed or not

let checkcount = 0;

function checkboxchanged(){
    checkcount = 0;
    allcheckbox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkcount++;
        }
    });
    //special case if checked box is greater then password_len then
    if(checkcount > password_len){
        password_len = checkcount;
        handle_slider();
    }
};

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', checkboxchanged);
});
// till here we had created or find count of checkbox ticked


function suffle_password(arr){
    //fisher yates method
    let i = arr.length;
    while (--i > 0) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
    }
    let str = "";
    arr.forEach(e => {
        str += e;
    });
    return str;
}

generateBtn.addEventListener( 'click', () => {
    if(checkcount <= 0){
        return;
    }
    if(checkcount > password_len){
        password_len = checkcount;
        handle_slider();
    }
    
    //remove old password
    password = "";

    //let begin the journey

    //how randomly we can add rest of elements ?????

    // if(upper_letter.checked){
    //     password += getRandomUppercase();
    // }
    // if(lower_letter.checked){
    //     password += getRandomLowercase();
    // }
    // if(int_letter.checked){
    //     password += getRandomNumber();
    // }
    // if(symbol_letter.checked){
    //     password += getRandomSymbols();
    // }

    //we had inserted all the compulsory needs

    let funcArr = [];
    if(upper_letter.checked){
        funcArr.push(getRandomUppercase);
    }
    if(lower_letter.checked){
        funcArr.push(getRandomLowercase);
    }
    if(symbol_letter.checked){
        funcArr.push(getRandomSymbols);
    }
    if(int_letter.checked){
        funcArr.push(getRandomNumber);
    }
    //here we put all the compulsory elements required to generate password
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    
    //here we pushed all rest of elements needed randomly
    for(let i=0; i< password_len - funcArr.length ; i++ ){
        let randvar = getRandomInteger(0, funcArr.length);
        console.log(randvar);
        password += funcArr[randvar]();
    }
    
    // now always we get upperletter, then accordingly as mentioned so suffle requirement
    password = suffle_password(Array.from(password));

    password_display.value = password;
    calculate_strength();
});
