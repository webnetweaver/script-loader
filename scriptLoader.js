//script manipulation

function addScript(url, async, callback)
{
	var script = document.createElement("script");

	if(callback!=null && callback!="")
	{
		if (script.readyState)
		{  //IE
	        script.onreadystatechange = function(){
		        if (script.readyState == "loaded" || script.readyState == "complete")
				{
		            script.onreadystatechange = null;
		            eval(callback);
		        }
	        };
	    }
		else
		{
	        script.onload = function(){
	            eval(callback);
	        };
	    }
	}

	if(async)
		script.async = true;
	script.src = decodeURIComponent(url);
	var scripts = document.getElementsByTagName("script");
	scripts[0].parentNode.insertBefore(script,scripts[0]);
}

function addScriptList(list)
{
	nScriptLists.push(list);
	if(nScriptList != null)
	{
		return;
	}
	else
	{
		nScriptList = list;
		nScriptListIndex = 0;
		addScript(encodeURIComponent(list[0].url), list[0].async, "addScriptListNext()");
	}
}

function addScriptListNext()
{
	if(nScriptList[nScriptListIndex].callback!=null)
		eval(nScriptList[nScriptListIndex].callback);

	nScriptListIndex++;

	if(nScriptListIndex == nScriptList.length)
	{
		nScriptLists.shift();
		if(nScriptLists.length>0)
		{
			nScriptList = nScriptLists[0];
			nScriptListIndex = 0;
			addScript(encodeURIComponent(nScriptList[0].url), nScriptList[0].async, "addScriptListNext()");
		}
		else
		{
			nScriptList = null;
		}
	}
	else
		addScript(encodeURIComponent(nScriptList[nScriptListIndex].url), nScriptList[nScriptListIndex].async, "addScriptListNext()");	
}