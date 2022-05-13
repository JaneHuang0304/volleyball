
import { _decorator, Component, Node, Sprite, Collider2D, Contact2DType, IPhysics2DContact, 
        input, Input,  EventKeyboard, KeyCode, Vec3, Animation} from 'cc';
import { BallCtr } from './BallCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = robotCtr
 * DateTime = Mon May 09 2022 10:57:33 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = robotCtr.ts
 * FileBasenameNoExtension = robotCtr
 * URL = db://assets/Script/robotCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('robotCtr')
export class robotCtr extends Component {

    @property({ type: Sprite })
    public ballSprite: Sprite | null = null;

    @property({ type: Component })
    public Sloth2: Component | null = null;

    @property({type: Animation})
    public animation: Animation | null = null;

    private isAction = false;
    private speed = 0;
    private moveSpeed = 0;
    public isStart = false;
    private ActType: string;

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {        
        if (otherCollider.name == "ball<BoxCollider2D>"){
            this.isStart = false;
            this.setBallCtr(this.ActType);
        }
    }

    onKeyDown(event: EventKeyboard){
        let Pos = this.node.getPosition();
        switch(event.keyCode){

            case KeyCode.KEY_X:
                if (Pos.x < 380 && !this.isAction){
                    Vec3.add(Pos, Pos, new Vec3(30, 0, 0));
                }
                break;

            case KeyCode.KEY_Z:
                if (Pos.x > 90 && !this.isAction) {
                    Vec3.add(Pos, Pos, new Vec3(-30, 0, 0));
                }
                break;

            case KeyCode.KEY_S:
                if (!this.isAction){
                    this.isAction = true;
                    this.animation.play("r_jump");
                    this.ActType = "jump";
                }
                break;
        }  

        this.node.setPosition(Pos);   
    }

    setBallCtr(typr: string){
        if (this.ballSprite) {
            let ballController = this.ballSprite.getComponent(BallCtr);
            if (this.ActType == "jump"){
                ballController.setBalllv(-30, 0, 5, 1);
            }else{
                ballController.setBalllv(-13, -8, 1, 1);
            }
        }        
    }

    update (deltaTime: number) {
        if (this.isAction){
            let robotMagPos = this.node.getPosition();
            let robotPos = this.Sloth2.node.getPosition();
            this.node.setPosition(new Vec3(robotMagPos.x, -173 + robotPos.y, robotMagPos.z));
            this.speed += deltaTime;
            if (this.speed >= 0.37){
                this.isAction = false;
                this.ActType = "lean";
                this.speed = 0;
            }
        }else {
            if (this.ballSprite){
                this.moveSpeed += deltaTime;
                let robotPos = this.node.getPosition();
                let ballPos = this.ballSprite.node.getPosition();
                if (!this.isStart){
                    if (ballPos.x > 70 && ballPos.x < 400){
                        if (this.moveSpeed > 0.08){
                            if (robotPos.x > ballPos.x){
                                Vec3.add(robotPos, robotPos, new Vec3(-30, 0, 0));
                            } else{
                                Vec3.add(robotPos, robotPos, new Vec3(30, 0, 0));
                            }
                            this.node.setPosition(robotPos);
    
                            if (ballPos.y < 130 && ballPos.y > 100){
                                this.animation.play("r_jump");
                                this.isAction = true;
                                this.ActType = "jump";
                            }
                            this.moveSpeed = 0;
                        }
                    }
                }
            }
        }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
