let currentPanel = null;
let highScores = [ 
    { name:"Frank" , score:1000 , level:1 } , 
    { name:"Rinske" , score:5000 , level:5 } , 
    { name:"Cem" , score:4000 , level:4} ,
    { name:"Mark" , score:3000 , level:3} ,
    { name:"George" , score:2000  , level:2} ,
]; //TODO move to Game.js
Array.prototype.sortOn = function() {
    var b = this.slice();
    if (!arguments.length) return b.sort();
    var e = Array.prototype.slice.call(arguments);
    return b.sort(function(b, g) {
        for (var h = e.slice(), c = h.shift(); b[c] == g[c] && h.length;) c = h.shift();
        return b[c] == g[c] ? 0 : b[c] < g[c] ? 1 : -1
    })
};
highScores = highScores.sortOn("score");


        
function startBtnClick(){
    hideOthers();
    window.parent.startGame();
}

function showIntro(){
    showPanel(intro);
}

intro_startBtn.addEventListener('click', startBtnClick);

about_playBtn.addEventListener('click', () => {
    //showIntro();
    startBtnClick();
})

about_highscoresBtn.addEventListener('click' , () => {
    showHighscores(false);
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

highscores_resume.addEventListener('click', () => {
    hideOthers();
    window.parent.resumeGame();
})

highscores_newgame.addEventListener('click', () => {
    hideOthers();
    window.parent.newGame();
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

complete_highscoresBtn.addEventListener('click' , function() {
    showHighscores(true);
});

complete_nextBtn.addEventListener('click' , function() {
    hideOthers();
    window.parent.nextLevel();
});

function hideOthers(){
    if(currentPanel != null)currentPanel.style.top = '-75%';
    
    currentPanel = null;
}


let _startScore = 0;
let scoreTarget = 0;
let runningScore = 0;

function showPanel(panel){
    hideOthers();
    panel.style.top = '50%';
    currentPanel = panel;
}

function showHighscores(showResume){
    showPanel(highscores)

    jaja.innerHTML = "";
    

    for(let i = 0 ; i < highScores.length ; i++)
    {
        let row = jaja.insertRow();
        
        row.insertCell(0).innerHTML = i + 1;
        row.insertCell(1).innerHTML = highScores[i].name;
        row.insertCell(2).innerHTML = highScores[i].level;
        row.insertCell(3).innerHTML = highScores[i].score;
    }


    //if(showResume)highscores_resume.style.display = 'inline-block';
    //else highscores_resume.style.display = 'none';
    
}

function showTimeUp(score = 0 , startScore  = 0 , mobile ){
    //if(mobile)
    
    showPanel(timeup)
    timeup_total.innerText =   startScore;

    _startScore = startScore;
    scoreTarget = score ;
    runningScore = 0;
    requestAnimationFrame(animateScore);

    timeup_rocketsBtn.style.visibility = 'hidden';
   //if(!mobile) 
    setTimeout ( () => 
    {
        timeup_rocketsBtn.style.visibility = 'visible';
    } , 1250);
    //else 
    //    timeup_rocketsBtn.style.display = 'none';


    timeup_againBtn.style.visibility = 'hidden';
    setTimeout ( () => 
    {
        timeup_againBtn.style.visibility = 'visible';
    } , 750 );

    //timeup_multiBtn.style.display = 'none';
    //return;
    //the idea here isto get rid of the multituouch, replaced by rockets
    if(!mobile || window.navigator.maxTouchPoints <= 1){
        timeup_multiBtn.style.display = 'none';
        return;
    }

    timeup_multiBtn.style.display = 'inline-block'
    timeup_multiBtn.style.visibility = 'hidden';
    setTimeout ( () => 
    {
        timeup_multiBtn.style.visibility = 'visible';
    } , 1650 );
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
    let val = Math.round(runningScore) 
    timeup_score.innerText = val;
    complete_score.innerText = val;
    timeup_total.innerText =   _startScore + val;
    complete_total.innerText =   _startScore + val;
}

function checkHighScores(score)
{
    for(let i = 0 ; i < highScores.length ; i++){
        if(score >= highScores[i].score){
            let lvl = window.parent.game.currentLevel;
            highScores.splice(i , 0 , { name : "You" , level:lvl , score:score} )
            break;
        }
    }

    if(highScores.length > 5)highScores.length = 5;
}

function showMissionComplete(score = 1000 , startScore = 0 , mobile)
{
    showPanel(complete);
    checkHighScores(score + startScore)
    complete_total.innerText =   startScore;
     _startScore = startScore;
    scoreTarget = score ;
    runningScore = 0;
    requestAnimationFrame(animateScore);
    //complete_score.innerText = score ;

    complete_nextBtn.style.visibility = 'hidden'
    setTimeout ( () => {complete_nextBtn.style.visibility = 'visible'} , 1000);


    complete_highscoresBtn.style.visibility = 'hidden'
    setTimeout ( () => {complete_highscoresBtn.style.visibility = 'visible'} , 1500);

    
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
    if(window.parent.game.isMobile && window.navigator.maxTouchPoints > 1)
        timeup.className = "ui-panel foo"
    showIntro();
    windowResized();
};