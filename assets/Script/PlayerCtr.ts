
import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Vec3, 
        Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, Sprite, Animation } from 'cc';
import { BallCtr } from './BallCtr';
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

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        if (this.Sloth){
            this.animation = this.Sloth.getComponent(Animation);
        }

    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
      if (otherCollider.name == "ball<BoxCollider2D>"){
          this.setBallCtr(this.ActionType);
      }  
    }

    setBallCtr(type: string){
        if (this.ballSprite) {
            let ballController = this.ballSprite.getComponent(BallCtr);
            if (type == "jump"){
                ballController.setBalllv(13, -8, 1.5);
            }
            
            if (type == "lean"){
                ballController.setBalllv(13, 8, 1.5);
            }
        }        
    }

    onKeyDown(event: EventKeyboard) {
        let Pos = this.node.getPosition();
        switch(event.keyCode){
            // case KeyCode.ARROW_UP: 
            //     if (Pos.y < 240){
            //         Vec3.add(Pos, Pos, new Vec3(0, 20, 0));
            //     }
            //     break;

            // case KeyCode.ARROW_DOWN:
            //     if (Pos.y > -62) {
            //         Vec3.add(Pos, Pos, new Vec3(0, -20, 0));
            //     }
            //     break;

            case KeyCode.ARROW_RIGHT:
                if (Pos.x < -92 && !this.isAction){
                    Vec3.add(Pos, Pos, new Vec3(30, 0, 0));
                }
                break;

            case KeyCode.ARROW_LEFT:
                if (Pos.x > -412 && !this.isAction) {
                    Vec3.add(Pos, Pos, new Vec3(-30, 0, 0));
                }
                break;

            case KeyCode.ARROW_DOWN:
                if (Pos.x < -92 && !this.isAction){
                    this.isAction = true;
                    this.animation.play("lean");
                    this.ActionType = "lean";
                }
                break;

            case KeyCode.SPACE:
                if (!this.isAction){
                    this.isAction = true;
                    this.animation.play("jump");
                    this.ActionType = "jump";
                }
                break;
        }  

        this.node.setPosition(Pos);   
    }

    update (deltaTime: number) {
        if (this.isAction){
            this.speed += deltaTime;
            if (this.speed >= 0.35){
                this.isAction = false;
                this.speed = 0;
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
