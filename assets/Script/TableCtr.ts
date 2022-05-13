
import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact, Sprite, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TableCtr
 * DateTime = Wed May 04 2022 21:18:28 GMT+0800 (台北標準時間)
 * Author = jane1076
 * FileBasename = TableCtr.ts
 * FileBasenameNoExtension = TableCtr
 * URL = db://assets/Script/TableCtr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('TableCtr')
export class TableCtr extends Component {

    @property({ type: Sprite })
    public ballSprite: Sprite | null = null;

    private location;

    start () {
        let ballCollider = this.getComponent(Collider2D);
        if (ballCollider) {
            ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.name == "ball<BoxCollider2D>"){
            let ballPos = otherCollider.node.getPosition().x;

            if (ballPos > -443 && ballPos < 7) {
                this.location = 'left';
            }
    
            if (ballPos < 443 && ballPos > 7) {
                this.location = 'right';
            }
    
            this.node.emit('TableRet', this.location);
        }

        // if (this.ballSprite) {
        //     let ballController = this.ballSprite.getComponent(BallCtr);
        //     ballController.setBalllv(7, 14, 0.1);
        // }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
