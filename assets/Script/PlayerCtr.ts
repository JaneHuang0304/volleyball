
import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3, 
        Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, Sprite, Animation} from 'cc';
import { BallCtr } from './BallCtr';
import { ToolCtr } from './ToolCtr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerCtr
 * DateTime = Wed May 04 2022 10:56:29 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = PlayerCtr.ts
 * FileBasenameNoExtension = PlayerCtr
 * URL = db://assets/Script/PlayerCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('PlayerCtr')
export class PlayerCtr extends Component {

    @property({ type: Sprite })
    public ballSprite: Sprite | null = null;

    @property({ type: Component })
    public Sloth: Component | null = null;

    @property({type: Animation})
    public animation: Animation | null = null;

    private isAction = false;
    private speed = 0;
    private ActionType: string;
    private nowPos: Vec3;

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        
        if (this.Sloth){
            this.animation = this.Sloth.getComponent(Animation);
        }
        
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.name == "ball<CircleCollider2D>"){        
           this.setBallCtr(this.ActionType);
        }  

        if (otherCollider.name == "tool<BoxCollider2D>"){
            this.node.emit('GetTool', this);
        }
    }

    setRigidBody(type, x, y, gv: number){
        this.node.getComponent(RigidBody2D).type = type;
        let lv = this.node.getComponent(RigidBody2D).linearVelocity;
        lv.x = x == null ? lv.x : x;
        lv.y = y == null ? lv.y : y;
        this.node.getComponent(RigidBody2D).linearVelocity = lv;
        this.node.getComponent(RigidBody2D).gravityScale = gv;
    }

    setBallCtr(type: string){
        if (this.ballSprite) {
            let nowPos = this.node.getPosition().x;
            let ballController = this.ballSprite.getComponent(BallCtr);
            let gv, rt, y: number;

            if (ballController.getBallFrame() == 0){
                gv = 3;
                rt = 1;
                y = 3;
            } else if (ballController.getBallFrame() == 1){
                gv = 1;
                rt = 2;
                y = -2;
            } else{
                gv = 0;
                rt = 0;
                y = 0;
            }

            console.log(`gv:: ${gv} rt:: ${rt} y:: ${y}`);

            if (type == "jump"){
                if (nowPos > -150){
                    ballController.setBalllv(10, -10 + y, 9 + gv, 0 + rt);
                } else if (nowPos < -350){
                    ballController.setBalllv(17, -5 + y, 7 + gv, 0 + rt);
                } else {
                    ballController.setBalllv(14, -8 + y, 8 + gv, 0 + rt);
                }
                console.log(`balllv:: ${this.node.getComponent(RigidBody2D).linearVelocity}`);
            } else if (type == "lean"){
                if (nowPos > -150) {
                    ballController.setBalllv(10, 2 - y, 1.5 + gv, 1 + rt); 
                } else if (nowPos < -300){
                    ballController.setBalllv(17, 7 - y, 1 + gv, 1 + rt); 
                } else {
                    ballController.setBalllv(14, 4 - y, 1.5 + gv, 1 + rt);
                }
            } else{
                ballController.setBalllv(20, 15 + y, 0.5 + gv, 1 + rt);
            }
        }        
    }

    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
                if (!this.isAction){
                    this.setRigidBody(2, 15, null, 0);
                }
                break;

            case KeyCode.ARROW_LEFT:
                if (!this.isAction){
                    this.setRigidBody(2, -15, null, 0);
                }
                break;

            case KeyCode.ARROW_DOWN:
                if (this.nowPos.x < -92 && !this.isAction){
                    this.isAction = true;
                    this.animation.play("lean");
                    this.ActionType = "lean";
                }
                break;

            case KeyCode.SPACE:
                if (!this.isAction){
                    this.isAction = true;
                    this.setRigidBody(2, null, 43, 10);
                    this.ActionType = "jump";
                }
                break;
        }  
    }

    onKeyUp(event: EventKeyboard){
        switch(event.keyCode){
            case KeyCode.ARROW_RIGHT:
                this.setRigidBody(2, 0, 0, 50);
                break;

            case KeyCode.ARROW_LEFT:
                this.setRigidBody(2, 0, 0, 50);
                break;  
        }  
    }

    update (deltaTime: number) {
        this.nowPos = this.node.getPosition();
        if (this.isAction){
            this.speed += deltaTime;
            if (this.speed >= 0.85){
                this.isAction = false;
                this.speed = 0;
                this.ActionType = "ini";
                this.setRigidBody(2, 0, 0, 50);
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
