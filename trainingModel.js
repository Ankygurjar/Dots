let model;
let targetLabel = 'i';
let state = 'collection';

function setup(){
    createCanvas( 500, 550 );
    let options = {
        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        debug: true
    }
    let modelFiles = {
        model: './model/model.json',
        metadata: './model/model_meta.json',
        weights: './model/model.weights.bin'
    }
    model = ml5.neuralNetwork(options);
    // model.loadData('data.json', ()=>{
    //     console.log("Data Loaded")
    // })
    model.load( modelFiles, ()=>{
        console.log("Model is loaded")
        state = "prediction"
    })
    background(255);
}

function keyPressed(){
    if( key === 't'){
        state = 'training'
        model.normalizeData();
        let options = {
            epochs: 350
        }
        model.train( options, (epoch, loss)=>{

        }, ()=>{
            state = 'prediction'
            console.log("Finished Training");
        });
    }else if( key === 's' ){
        model.saveData('data');
    }else if( key === 'm'){
        model.save('model')
    }
    targetLabel = key;
    
}

function mousePressed(){
    let inputs = {
        x: mouseX,
        y: mouseY
    }
    if(state === 'collection'){
        let target = {
            label: targetLabel
        }
        model.addData(inputs, target);
        stroke(0);
        noFill();
        ellipse( mouseX, mouseY, 24);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(targetLabel.toUpperCase(), mouseX, mouseY);
    }else if(state === 'prediction'){
        model.classify(inputs, ( err, results )=>{
            if( err )   throw new Error(err);
            stroke(0);
            fill(0,0,255,100);
            ellipse( mouseX, mouseY, 24);
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            text(results[0].label, mouseX, mouseY);
        });
    }

}
