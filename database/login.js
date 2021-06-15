let username1=document.querySelector('#username')
let password1=document.querySelector('#password')

let sign_in_btn =document.querySelector('#sign_in')

sign_in_btn.addEventListener('click',function(e){

e.preventDefault();

if(username1.value === "" || password1.value ===""){
    alert('please fill the data');
}else{
    localStorage.setItem('username',username1.value)
    localStorage.setItem('password',password1.value)
    setTimeout( ()=>{


        window.location="index.html"
    },1000)
}


})