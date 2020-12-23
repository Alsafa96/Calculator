function calculatorLoad(){
    let humburgerIcon=document.getElementById('humburgerIcon');
    let bar1=document.getElementById('bar1');
    let bar3=document.getElementById('bar3');
    let bar2=document.getElementById('bar2');
    let navbarLinks=document.querySelector('.menuItems');

    let calculatorScreen=document.getElementById('calculatorScreen');
    calculatorScreen.value='0';

    //Clear the local storage:-
    localStorage.clear();

    //Show/Hide the drop down menu:-

    humburgerIcon.addEventListener('click',()=>{
       let value=navbarLinks.classList.contains('calculatorTypes--collapse');

       if (value){
            navbarLinks.classList.remove('calculatorTypes--collapse');
       }

       else {
            navbarLinks.classList.add('calculatorTypes--collapse');
       }


       //Animate the humburger Button:-
       bar1.classList.toggle('bar1--clicked');
       bar3.classList.toggle('bar3--clicked');
       bar2.classList.toggle('bar2--clicked');
    })

    //Set the standard and scientific buttons:-
    let standardBtn=document.getElementById('standard');
    let scientificBtn=document.getElementById('scientific');

    standardBtn.addEventListener('click',()=>{
        localStorage.setItem('calculatorType','standard');
        navbarLinks.classList.remove('calculatorTypes--collapse');
        
         //Animate the humburger Button:-
        bar1.classList.toggle('bar1--clicked');
        bar3.classList.toggle('bar3--clicked');
        bar2.classList.toggle('bar2--clicked');
        generateButtons();
    })

    scientificBtn.addEventListener("click",()=>{
        localStorage.setItem('calculatorType','scientific');
        navbarLinks.classList.remove('calculatorTypes--collapse');

         //Animate the humburger Button:-
        bar1.classList.toggle('bar1--clicked');
        bar3.classList.toggle('bar3--clicked');
        bar2.classList.toggle('bar2--clicked');
        generateButtons();
    })

        //Escape regular expression:-
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
    }

     //Evaluation Of Mathmatic functions:-
     function evalMathFunc(str){
         let funcList=['sin','cos','tan'];

         //Locate indexes of each function:-
         for(let i=0;i<funcList.length;i++){

            var regex = new RegExp(funcList[i],'g');
        
            var current;
            var matchIndexes = [];

            while ((current = regex.exec(str)) != null)
             {
                matchIndexes.push(current.index);
  
            }
            
            for(let j=0;j<matchIndexes.length;j++){

             let funcIndex=matchIndexes[j];
             let openParenthCount=1;
             let closeParenthCount=0;
             let openParenthIndex=funcIndex+funcList[i].length;
             let closeParenthIndex;
             
             
             //Determining the parameter of the function for evaluation:-
             for(let i=openParenthIndex+1;i<str.length;i++){
                 if(str[i]==='('){
                     openParenthCount++;
                 } else if(str[i]===')'){
                     closeParenthCount++;
                     if(openParenthCount===closeParenthCount){
                        closeParenthIndex=i;
                        break;
                     }
                 }
             }
             if(openParenthCount>closeParenthCount){
                 closeParenthIndex=str.length-1;
             }

             
             //Convert radians to degrees :-
                 if(funcList[i]==='sin' || funcList[i]==='cos' || funcList[i]==='tan'){
                     str=str.substring(0,closeParenthIndex) +' deg'+str.substring(closeParenthIndex,str.length);
                 }

            }

         }
         return str;
     }

    

    //evaluation of input value:-
    function evaluateInput(val){
        
        let opList=['sin','cos','tan','log','abs','sqr','ln','╥','(',')'];
        for(let i=0;i<opList.length;i++){
            opList[i]=escapeRegExp(opList[i]);
            var regex = new RegExp(opList[i],'g');
        
            var current;
            var matchIndexes = [];

            while ((current = regex.exec(val)) != null)
             {
                matchIndexes.push(current.index);
  
            }
              
              let increment=0;
              for(let j=-1;j<matchIndexes.length;j++){
                  let newVal=[...val];
                if(!isNaN(newVal[matchIndexes[j]-1+increment]) || newVal[matchIndexes[j]-1+increment]==='╥'){
                    if(newVal[matchIndexes[j]+increment]!==')'){
                        newVal.splice(matchIndexes[j]+increment,0,'*');
                        increment++;
                    } else if(newVal[matchIndexes[j]+increment]===')'){
                        
                        if(['+','-','*','/','%','^',')',','].indexOf(newVal[matchIndexes[j]+1+increment])===-1 && matchIndexes[j]+increment<newVal.length-1){
                            newVal.splice(matchIndexes[j]+1+increment,0,'*');
                            increment++;
                             
                        } 
                        
                    }
                   
                }

                if((newVal[matchIndexes[j]+increment]==='╥') && (!isNaN(newVal[matchIndexes[j]+1+increment]) || ['+','-','*','/','%','^',')'].indexOf(newVal[matchIndexes[j]+1+increment])===-1 && matchIndexes[j]+increment<newVal.length-1)){
                    newVal.splice(matchIndexes[j]+1+increment,0,'*');
                    increment++;
                }

                matchIndexes[j]+=increment;
                val=newVal.join('');
            }  
        }
        
        val=val.replaceAll('╥',Math.PI);
        
        //Evaluate Mathmatic Functions:-
        val=evalMathFunc(val);
        val=val.replaceAll('sqr','sqrt');
        val=val.replaceAll('log','log10');
        val=val.replaceAll('ln','log');
        return val;

    }

    //Check if this is the first input and check if our input is beyond textfield width limit:-
    function checkInput(textToInsert){
        if(calculatorScreen.value==='0'){
            calculatorScreen.value=textToInsert;
        }
        else{
          calculatorScreen.value+=textToInsert;
        }
        
        if(calculatorScreen.scrollWidth>calculatorScreen.clientWidth) calculatorScreen.value='0';
    }

    let evaluated=false;

    //Check if what on the screen is the result of previous operation:-
    function checkIfEvaluated(){
        if(evaluated){
            calculatorScreen.value='0';
        }
        return false;
    }

    //Create Array:-
    function makeArray(){
        let nums=calculatorScreen.value.split(/\+|\-|\*|\/|\%|\^|\(|\)/g);
        let revNumbs=nums.reverse();
        if(!revNumbs[revNumbs.length-1]) revNumbs.pop();
        return revNumbs;
    }

    //Create The buttons dynamically:-

    
    //generateButtons on load:-
    generateButtons();

    function generateButtons(){
        let standard=['C','+/-','backspace','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','='];
        let scientific=['sin','cos','tan','log','1/X','X^2','X^3','X^y','abs','sqr','PI','ln','%','(',')'];

        let signed=false;

        //The calculator buttons container:-
        let calculatorButtons=document.getElementById('calculatorButtons');

        //Clear all previously present buttons:-
        calculatorButtons.innerHTML='';
    
        if (localStorage.getItem('calculatorType')===null){
            localStorage.setItem('calculatorType','standard');
        }
    
        let isScientific=localStorage.getItem('calculatorType')
        if (isScientific==='scientific'){

            //Create scientific calculator

            let scientificBtnsContainer=document.createElement('div');
            scientificBtnsContainer.classList.add('scientificButtons');
           
            //loop through each scientific button key:-
            scientific.forEach((key)=>{
                let btn=document.createElement('button');
                //Setting its attributes:-
                btn.type='button';
                btn.classList.add('scientificButton');
                btn.textContent=key;

                //Adding the button to the container:-
                scientificBtnsContainer.appendChild(btn);

                //Set the place for line break:-
                let insertLineBreak=['tan','X^2','abs','ln'].indexOf(key)!==-1;
                if(insertLineBreak){
                    scientificBtnsContainer.appendChild(document.createElement('br'));
                }

                //Program functions for buttons:-
                
                switch(key){
                    case '(':
                    case ')':
                    case '%':
                      btn.addEventListener('click',()=>{
                          evaluated=checkIfEvaluated();
                          checkInput(btn.textContent);
                          signed=false;
                      })
                      break;
                    case 'PI':
                       btn.addEventListener('click',()=>{
                           evaluated=checkIfEvaluated();
                           checkInput('╥');
                       })
                       break;
                    case 'X^2':
                           
                       btn.addEventListener('click',()=>{
                           checkInput('^2');
                           signed=false;
                           evaluated=false;
                       })
                       break;
                    case 'X^3':
                       btn.addEventListener('click',()=>{
                           checkInput('^3');
                           signed=false;
                           evaluated=false;
                       })
                       break;
                    case 'X^y':
                       btn.addEventListener('click',()=>{
                           checkInput('^');
                           signed=false;
                           evaluated=false;
                       })
                       break;
                    case '1/X':
                       btn.addEventListener('click',()=>{
                           calculatorScreen.value=1/(math.evaluate(evaluateInput(calculatorScreen.value)));
                           evaluated=false;
                       })
                       break;
                    case 'abs':
                       btn.addEventListener('click',()=>{
                           calculatorScreen.value=Math.abs(math.evaluate(evaluateInput(calculatorScreen.value)));
                           evaluated=true;
                       })
                       break;
                    default:
                       btn.addEventListener('click',()=>{
                           evaluated=checkIfEvaluated();
                           checkInput(btn.textContent+'(');
                           signed=false;
                       })
                       break;
                }

            })

            calculatorButtons.appendChild(scientificBtnsContainer);
            
        } 
        //Standard Buttons:-

        //Create standard calculator
        let standardBtnsContainer=document.createElement('div');
        standardBtnsContainer.classList.add('standardButtons');
        //loop through each standard button key:-
        standard.forEach((key)=>{
            let btn=document.createElement('button');
            //Setting its attributes:-
            btn.type='button';
            btn.classList.add('standardButton');
            btn.textContent=key;
            if(key==='backspace'){
                btn.classList.add('material-icons');
            }

            else if(key==='='){
                btn.id='equal';
            }

            //Adding the button to the container:-
            standardBtnsContainer.appendChild(btn);

            //Set the place for line break:-
            let insertLineBreak=['/','*','-','+'].indexOf(key)!==-1;
            if(insertLineBreak){
                standardBtnsContainer.appendChild(document.createElement('br'));
            }

            //Program functions for buttons:-
          
            switch(key){
                case 'C':
                    evaluated=false;
                    btn.addEventListener('click',()=>{
                        calculatorScreen.value='0';
                    })
                    break;
                case 'backspace':
                    btn.addEventListener('click',()=>{
                        evaluated=checkIfEvaluated();
                        calculatorScreen.value=calculatorScreen.value.substring(0,calculatorScreen.value.length-1);
                        if(calculatorScreen.value.length===0){
                            calculatorScreen.value='0';
                        }
                    })
                    break;
                case '+/-':
                    btn.addEventListener('click',()=>{
                        evaluated=false;
                        let revNumbs=makeArray();

                        if(revNumbs.length===1){
                            calculatorScreen.value=eval(calculatorScreen.value)*-1;
                            signed=true;
                        }
                        else{
                            if(!signed){
                                calculatorScreen.value=calculatorScreen.value.slice(0,calculatorScreen.value.lastIndexOf(revNumbs[0]))+eval(revNumbs[0]*(-1));
                                signed=true;
                            } else{
                                calculatorScreen.value=calculatorScreen.value.slice(0,calculatorScreen.value.lastIndexOf('-'))+revNumbs[0];
                                signed=false;
                            }          
                        }
                        
                    })
                    
                    break;
                case '=':
                    //Evaluate and give result.
                    btn.addEventListener('click',()=>{
                        calculatorScreen.value=math.evaluate(evaluateInput(calculatorScreen.value));  
                        evaluated=true;
                    })
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                    btn.addEventListener('click',()=>{
                        if(['+','-','*','/'].indexOf(calculatorScreen.value[calculatorScreen.value.length-1])!==-1) return;
                        calculatorScreen.value+=btn.textContent;
                        if(calculatorScreen.scrollWidth>calculatorScreen.clientWidth) calculatorScreen.value='0';
                        signed=false;
                        evaluated=false;
                    })
                    break;
                case '.':
                    btn.addEventListener('click',()=>{
                        evaluated=checkIfEvaluated();
                        let numbs=makeArray();
                        if(numbs[0].includes('.')) return;
                        calculatorScreen.value+='.';
                    })
                    break;
                default:
                    btn.addEventListener('click',()=>{
                        evaluated=checkIfEvaluated();
                        checkInput(btn.textContent);
                    })

            }

        })
        calculatorButtons.appendChild(standardBtnsContainer);

    }

}

//Run:-
calculatorLoad();