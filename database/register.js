
let username=document.querySelector('#username')
let email=document.querySelector('#email')
let password=document.querySelector('#password')

let register_btn =document.querySelector('#sign_up')

register_btn.addEventListener('click',function(e){

e.preventDefault();
if(username.value === "" || email.value=== ""|| password.value ===""){
    alert('please fill the data');
}else{
    localStorage.setItem('username',username.value)
    localStorage.setItem('password',password.value)
    localStorage.setItem('email',email.value)
    setTimeout( ()=>{


        window.location="index.html"
    },1000)
}


})