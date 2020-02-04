
window.onload=function(){
  chrome.runtime.sendMessage({type:"toggle"},function(res){
     document.getElementById("checkbox").checked=(res.toggle=='true')||false
  })
    document.getElementById("checkbox").addEventListener("click",function(){
  chrome.runtime.sendMessage({type:"changeToggle"},function(res){
  })




    })
}

