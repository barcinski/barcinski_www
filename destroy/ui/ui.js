let currentPanel = null;
        
function startBtnClick(){
    hideOthers();
    window.parent.startGame();
}

function showIntro(){
    showPanel(intro);
}

intro_startBtn.addEventListener('click', startBtnClick);

about_introBtn.addEventListener('click', () => {
    showIntro();
})

about_creditsBtn.addEventListener('click' , () => {
    showPanel(credits)
})

credits_aboutBtn.addEventListener('click' , () => {
    showPanel(about);
})
credits_introBtn.addEventListener('click' , () => {
    showIntro();
})

timeup_multiBtn.addEventListener('click', () => {
    window.parent.game.multitouch = true;
    startBtnClick();
})

timeup_rocketsBtn.addEventListener('click', () => {
    window.parent.game.useRockets = true;
    startBtnClick();
})


settings_cancelBtn.addEventListener('click' , () => {
    showIntro();
})

settings_applyBtn.addEventListener('click' , () => {
    const showStats = parseInt( statsSelect.value );
    const isMobile = (mobileSelect.value === 'true');
    const quality = parseInt( qualitySelect.value );       
    const ao = parseInt( aoSelect.value );       

    window.parent.applySettings( showStats , isMobile , quality , ao )

    showIntro();
})



timeup_againBtn.addEventListener('click', startBtnClick);

intro_aboutBtn.addEventListener('click', function() {
    showPanel(about)
});

complete_multiBtn.addEventListener('click' , function() {
    hideOthers();
    window.parent.game.multitouch = true;
    window.parent.nextLevel();
});

complete_nextBtn.addEventListener('click' , function() {
    hideOthers();
    window.parent.nextLevel();
});

function hideOthers(){
    if(currentPanel != null)currentPanel.style.top = '-75%';
    
    currentPanel = null;
}


let scoreTarget = 0;
let runningScore = 0;

function showPanel(panel){
    hideOthers();
    panel.style.top = '50%';
    currentPanel = panel;
}

function showTimeUp(score , mobile ){
    //if(mobile)
    
    showPanel(timeup)

    scoreTarget = score;
    runningScore = 0;
    requestAnimationFrame(animateScore);

    timeup_rocketsBtn.style.visibility = 'hidden';
    if(!mobile) setTimeout ( () => 
    {
        timeup_rocketsBtn.style.visibility = 'visible';
    } , 1250);
    else 
        timeup_rocketsBtn.style.display = 'none';


    timeup_againBtn.style.visibility = 'hidden';
    setTimeout ( () => 
    {
        timeup_againBtn.style.visibility = 'visible';
    } , 750 );

    if(!mobile || window.navigator.maxTouchPoints <= 1){
        timeup_multiBtn.style.display = 'none';
        return;
    }

    timeup_multiBtn.style.display = 'inline-block'
    timeup_multiBtn.style.visibility = 'hidden';
    setTimeout ( () => 
    {
        timeup_multiBtn.style.visibility = 'visible';
    } , 1250 );
}

function showSettings(game,stats){
    showPanel(settings);

    for(let i = 0 ; i < qualitySelect.options.length ; i++){
        if(qualitySelect.options[i].value == game.quality){
            qualitySelect.selectedIndex = i;
        }
    }

    for(let i = 0 ; i < aoSelect.options.length ; i++){
        if(aoSelect.options[i].value == game.ao){
            aoSelect.selectedIndex = i;
        }
    }
    
    if(game.isMobile == false){
        mobileSelect.selectedIndex = 1;
    }
    
    if(stats){
        statsSelect.selectedIndex = 1;
    }
}

function animateScore(){
    if(scoreTarget - runningScore < 0.1)runningScore = scoreTarget;
    if(runningScore < scoreTarget){
        runningScore += Math.min( (scoreTarget - runningScore) * 0.1 , 11);
        //runningScore++;
        requestAnimationFrame(animateScore);
    }
    timeup_score.innerText = Math.round(runningScore) ;
    complete_score.innerText = Math.round(runningScore) ;
}

function showMissionComplete(score = 1000 , mobile){
    showPanel(complete);

    scoreTarget = score;
    runningScore = 0;
    requestAnimationFrame(animateScore);
    //complete_score.innerText = score ;

    complete_nextBtn.style.visibility = 'hidden'
    setTimeout ( () => {complete_nextBtn.style.visibility = 'visible'} , 1000);

    
     complete_multiBtn.style.display = 'none';
     return;// the idea is to remove this button from this panel 

    if(!mobile || window.navigator.maxTouchPoints <= 1){
        complete_multiBtn.style.display = 'none';
        return;
    }

    complete_multiBtn.style.visibility = 'hidden'
    setTimeout ( () => {complete_multiBtn.style.visibility = 'visible'} , 1500);

    
}

function windowResized(e){
    
    let aspect = window.innerWidth / window.innerHeight;
    
    
    if(aspect>1.0   )
        main.style.zoom = Math.min(window.innerHeight / 325 , 1.25) ;
    else
        main.style.zoom =   Math.min(window.innerWidth / 325 , 1.25) ;

    
}

window.addEventListener('resize' , windowResized);
document.body.onload = () => {
    showIntro();
    // showSettings(window.parent.game,window.parent.stats);
    //showTimeUp(1111 , window.parent.game.isMobile)
   //  showMissionComplete(1111 , window.parent.game.isMobile);
    windowResized();
};