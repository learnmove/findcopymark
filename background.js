chrome.runtime.onMessage.addListener(
	function(req,s,res){
		if(req.type=="toggle"){
			res({toggle:localStorage.getItem("fmc")})
		}
		else if (req.type=="changeToggle"){
			if(localStorage.getItem("fmc")==null){
			localStorage.setItem("fmc",true)
			}else{
			localStorage.setItem("fmc",!(localStorage.getItem("fmc")=='true'))
			}

		}
	}
)
