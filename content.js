window.onload=function(){	
	let documentCopy=document
	let currentChangedDom=[]
	let word=""
	let DomClicked=""
	let currentViewNode
	let currentViewNodeIndex=1
	let unlockCopy=false
  const directCopyEvents = ['copy', 'cut', 'contextmenu', 'selectstart']
document.body.style.userSelect ="auto"

document.onkeyup = function(e) {
  if (e.which == 192&&e.ctrlKey ) {
  chrome.runtime.sendMessage({type:"changeToggle"},function(res){
  } )
}}
directCopyEvents.forEach(evt=>{
document.documentElement.addEventListener(evt, function (e) { // Not compatible with IE < 9
	e.stopImmediatePropagation()
}, true);
})


document.getElementsByTagName("body")[0].addEventListener("mouseup",(e)=>{

DomClicked=e.target

let url=document.URL
let reurl
let UrlparentNode=window.getSelection().getRangeAt(0).endContainer.parentNode

reurl=url.match(/(facebook|twitter|medium|codepen|jsfiddle|messenger)/)
if(reurl!=null){
switch(reurl[0]){
	case "facebook":
		if(UrlparentNode.dataset.text!==undefined){
			return
		}
	break;
	case "messenger":
			return
	break;
	case "medium":
		if(UrlparentNode.classList.contains("is-selected")){
			return
		}
	break;	
	case "twitter":
		if(UrlparentNode.parentNode.classList.contains("tweet-box")){
			return
		}
	break;
	case "jsfiddle":
			return
	break;
	case "codepen":
			return
	break;
	case "codepen":
			return
	break;

	default:
	break;

}	
}



if(DomClicked.nodeName.match(/(TEXT|INPUT)/)){
	return
}
	chrome.runtime.sendMessage({type:"toggle"},function(res){
		if(res.toggle=="true"){
	if(e.which==1&&DomClicked.id!="targetFind"){
currentViewNodeIndex=1


		word=window.getSelection().toString().trim()
	if(document.getElementById("FMCdiv")!==null ){

		document.getElementById("FMCdiv").remove()

	}
	if(currentChangedDom.length>0)	{
	ClearColor()


	}

	if(word.trim().length>0&&!word.match(/^\.+/)&&!word.match(/\|/)){
	
	document.execCommand('copy')
	let tree=document.getElementsByTagName("body")[0]



	// console.log(window.getSelection().toString())
		// if(word!=""){				//what the fuck why  empty happen????
				let st=new SearchText(word)
			if(word.length<300){

				st.dfs(tree)
				// }else{
					// console.log("謝謝")
				// }

				createSearchDom()

			}

	}





	}




		}
	})

})
function SearchText(text){
	this.text=text
}
function ClearColor(){
	for(let i=0;i<currentChangedDom.length;i++){
							
		currentChangedDom[i].textContent=currentChangedDom[i].textContent.replace(/❤\s/g,"")

	}
	currentChangedDom=[]
	return 
}

let count=0

SearchText.prototype.littleSearch=function(node){
	if(node.nextSibling!==null){
	if(node.nextSibling.textContent.match(/\w+/)){return node.textContent+node.nextSibling.textContent}

		return node.textContent+(node.nextSibling!==null?this.littleSearch(node.nextSibling):"")
	}

	return ""
}
SearchText.prototype.unlockCopy=function(tree){
	console.log( tree["oncontextmenu"])

	console.log(tree)
	if(tree.childNodes.length>0){
		for(let i=0;i<tree.childNodes.length;i++){

				this.unlockCopy(tree.childNodes[i])

		}

	}else{

		return
	}
}

SearchText.prototype.dfs=function(tree){

	if(tree.childNodes.length>0){
		for(let i=0;i<tree.childNodes.length;i++){

				this.dfs(tree.childNodes[i])

		}

	}else{
		if(tree.parentNode.nodeName.match(/^(SPAN|P|TD|PRE|EM|CODE|STRONG|SMALL|A|B|H1|H2|FONT)$/) ){
			// 可能td會直接寫文字，然後再夾雜span，然後td的text和td裡span的text都可能有要找的字
			// tree.nextSibling==null 過濾眾多兒子下只挑最後一個出來做處理
			// tree.parentNode.nodeName 不處理nodeName為text，因為爸爸的兒子還可能有孫子
					let re=""
						let language=""
						let testEnglish=new RegExp(/^\w+$/)
						let testPhp=new RegExp(/^\\\$.+/)
						let testArrow=new RegExp(/\w+->\w+/)
						let testC=new RegExp(/\w+::\w+/)
						let testSpecial=new  RegExp(/^(\\\*|\&)/)
						let testCommonProgramLanguage=new RegExp(/\w+\.\w/)
						let protectParenthesis= new RegExp(/(\(|\)|\*|\+|\$|\[|\])/g)
						afterParenthesisProtect=this.text.replace(protectParenthesis,"\\$1")
						if(testEnglish.test(afterParenthesisProtect)){
							 language="english"
							 re=new RegExp("\\b"+afterParenthesisProtect+"\\b","gi")

						}else if(testCommonProgramLanguage.test(afterParenthesisProtect)){

							 re=new RegExp(afterParenthesisProtect,"gi")
							 language="common"
						}
						else if(testPhp.test(afterParenthesisProtect)&&afterParenthesisProtect.match(/\$\w+/)){

							 re=new RegExp(afterParenthesisProtect,"gi")
							 language="php"
						}else if(testC.test(afterParenthesisProtect)){
							 re=new RegExp(afterParenthesisProtect,"gi")
							 language="c"
						}
						else{

							 re=new RegExp(afterParenthesisProtect,"gi")
						}

						if(language=="english"&&tree.textContent.match(re) ){

							if(tree.parentNode!==DomClicked){
								tree.textContent=tree.textContent.replace(re,"❤ "+word)
							}
						
							currentChangedDom.push(tree)
						}else if(language=="common"&&tree.textContent.match(this.text.split('.')[0])&&tree.textContent.length>=1){

							if(tree.parentNode.nextSibling!==undefined){
								if(this.littleSearch(tree.parentNode).match(re)){
								tree.textContent=tree.textContent.replace(this.text.split('.')[0],"❤ "+this.text.split('.')[0])
								currentChangedDom.push(tree)

								}
							}
						}
						else if(language=="php" &&tree.textContent==this.text.slice(0,tree.textContent.length)&&tree.textContent.length>=1){

								// console.log(this.text.split("->"))
								if(this.text.length==tree.textContent.length){
									tree.textContent=tree.textContent.replace(tree.textContent,"❤ "+tree.textContent)
									currentChangedDom.push(tree)
								}else{
									// if(tree.parentNode.parentNode.textContent.trim().slice(0,this.text.length)==this.text){
									if(tree.parentNode.parentNode.textContent.trim().match(re)){
									tree.textContent=tree.textContent.replace(tree.textContent,"❤ "+tree.textContent)
									currentChangedDom.push(tree)

									}
								}

							// if(this.text.length>=tree.textContent.length){

							// }else{

							}else if(language=="c"&&tree.textContent==this.text.slice(0,tree.textContent.length)&&tree.textContent.length>=1){

								if(this.littleSearch(tree.parentNode).match(re)){
								tree.textContent=tree.textContent.replace(this.text.split('::')[0],"❤ "+tree.textContent)
								currentChangedDom.push(tree)
								}


							}
							else if(tree.textContent.match(re) ){

							if(tree.parentNode!==DomClicked){
								tree.textContent=tree.textContent.replace(re,"❤ "+word)
							}
						
							currentChangedDom.push(tree)
							}



							// if(this.github_judgeNextSibling_recursive(tree).match(re)){
							// 	tree.textContent=tree.textContent.replace("$this","❤ $this")

							// }



						// else if(language=="php" &&tree.parentNode.nextSibling!=null ){

						// 	if(tree.parentNode.nextSibling.nextSibling!=null){
						// 		if((tree.textContent+tree.parentNode.nextSibling.textContent+tree.parentNode.nextSibling.nextSibling.textContent).match(re) && tree.parentNode!=DomClicked){



						// 	if(tree.parentNode!==DomClicked){
						// 			tree.textContent=tree.textContent.replace("$this","❤ $this")
						// 	}

						// 			currentChangedDom.push(tree)
						// 			}
						// 	}


						// }










						// 處理 $xx->xx->ffhdr 和xxx.fff
						// else  if(language=="common" &&tree.parentNode.nextSibling!=null ){

						// 	if(tree.parentNode.nextSibling.nextSibling!=null){
						// 		if((tree.textContent+tree.parentNode.nextSibling.textContent+tree.parentNode.nextSibling.nextSibling.textContent).match(re) && tree.parentNode!=DomClicked){



						// 	if(tree.parentNode!==DomClicked){
						// 			tree.textContent=tree.textContent.replace("$this","❤ $this")
						// 	}

						// 			currentChangedDom.push(tree)
						// 			}
						// 	}


						// }


					// if(tree.parentNode.textContent.match(re)){

					// 		beforeChangeDomInnerHTML.push(tree.parentNode.innerHTML)
					// 		currentChangedDom.push(tree.parentNode)
					// 		console.log(currentChangedDom.length)
					// 		console.log(tree.parentNode)
					// 		console.log(tree.parentNode.textContent)

					// 		let re2=new RegExp(this.text,"ig")
					// 		// let rep1=tree.parentNode.textContent.replace(re2,'<span style="color:yellow;background-color:red">'+this.text+'</span>')
					// 		// console.log(rep1)
					// 		// tree.parentNode.innerHTML=tree.parentNode.innerHTML.replace(tree.parentNode.textContent,rep1)
					// 		console.log("-------after-------")
					// 		// 遇到 <span class=""  剛好又找class會取代錯誤變成<span <span style....= ""
					// }

		}
	}


}	

function createSearchDom(){
	let searchDiv= document.createElement("DIV")
	let WrapTextImg= document.createElement("DIV")
	let TextDiv= document.createElement("DIV")

	let Searchlink= document.createElement("A")
	let YoutubeLink=document.createElement("A")
	let youtubeImg= document.createElement("IMG")
	let searchImg= document.createElement("IMG")
	let Searchtext=document.createTextNode("Total:"+currentChangedDom.length)
	let targetFind
	searchDiv.style.position="fixed"
	searchDiv.style.top=window.innerHeight/2+"px"
	searchDiv.id="FMCdiv"
	searchImg.src=chrome.extension.getURL("searchButton2.gif")
	youtubeImg.src=chrome.extension.getURL("youtube.png")
	WrapTextImg.appendChild(searchImg)
	TextDiv.appendChild(Searchtext)
	TextDiv.style.backgroundColor="#5FBA7D"
	TextDiv.style.color="#E6FFEA"
	TextDiv.style.padding="3px";
    TextDiv.style.borderRadius="11px";
    TextDiv.style.fontSize= "6px";
    targetFind=TextDiv.cloneNode(true)
    targetFind.id="targetFind"
    targetFind.childNodes[0].textContent=currentViewNodeIndex+"/"+currentChangedDom.length
    targetFind.addEventListener("mousedown",()=>{
    	currentViewNodeIndex++
    	if(currentViewNodeIndex>currentChangedDom.length){
    		currentViewNodeIndex=1
targetFind.childNodes[0].textContent=currentViewNodeIndex+"/"+currentChangedDom.length

    	currentChangedDom[currentViewNodeIndex-1].parentNode.scrollIntoView()

    	}else{
    		targetFind.childNodes[0].textContent=currentViewNodeIndex+"/"+currentChangedDom.length
    	currentChangedDom[currentViewNodeIndex-1].parentNode.scrollIntoView()
    	}

})
    YoutubeLink.appendChild(youtubeImg);
	YoutubeLink.setAttribute('href',`https://www.youtube.com/results?search_query=${word}`)
	YoutubeLink.setAttribute('target',"_blank")
	

	Searchlink.innerHTML=WrapTextImg.outerHTML
	Searchlink.setAttribute('href',`https://www.google.com.tw/search?q=${word}`)
	Searchlink.setAttribute('target',"_blank")
	Searchlink.style.textDecoration="none"
	searchDiv.appendChild(Searchlink)
	searchDiv.appendChild(YoutubeLink)
	searchDiv.appendChild(targetFind)
	searchDiv.style.zIndex=10000
	document.body.appendChild(searchDiv)

}

}

