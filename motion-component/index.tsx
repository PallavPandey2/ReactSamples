import * as React from 'react';
import './styles.scss';

export interface IMotionProps {
    position?: number;
    children: JSX.Element[];
    showNavigation?: boolean;
    autoRun?: boolean;
    onMouseOver?: () => void;
    onMouseLeave?: () => void;
    onNextClick?: () => void;
    onPreviousClick?: () => void;
}

export interface IMotionState {
    position: number;
}

export default class Motion extends React.Component<IMotionProps, IMotionState>{
    private intervalTimer: any;
    constructor(props: IMotionProps) {
        super(props);

        this.state = {
            position: this.props.autoRun != false ? 0 : this.props.position
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
        this.onPreviousClick = this.onPreviousClick.bind(this);
    }

    private progressSlideshow() {
        this.intervalTimer = setInterval(() => {
            var { position } = this.state;
            var { children } = this.props;
            this.setState({
                position: position == children.length - 1 ? 0 : position + 1
            });
        }, 4000);
    }

    private stopSlideShow() {
        clearInterval(this.intervalTimer);
        this.intervalTimer = null;
    }

    private getTransformProperty() {
        return `translateX(calc(${this.props.autoRun == false ? this.props.position : this.state.position}*(-100%)))`;
    }

    private onMouseEnter() {
        if (this.props.autoRun == false) {
            this.props.onMouseOver();
        }
        else {
            this.stopSlideShow();
        }
    }

    private onMouseLeave() {
        if (this.props.autoRun == false) {
            this.props.onMouseLeave();
        }
        else {
            this.progressSlideshow();
        }
    }

    private goInDirection(direction: string) {
        var { position } = this.state;
        var { children } = this.props;
        if (direction == "next")
            this.setState({
                position: position == children.length - 1 ? 0 : position + 1
            });
        else
            this.setState({
                position: position == 0 ? children.length - 1 : position - 1
            });
    }

    private onNextClick() {
        if (this.props.autoRun == false) {
            this.props.onNextClick();
        }
        else {
            this.goInDirection("next");
        }
    }

    private onPreviousClick() {
        if (this.props.autoRun == false) {
            this.props.onPreviousClick();
        }
        else {
            this.goInDirection("previous");
        }
    }

    public componentDidMount() {
        if (this.props.autoRun != false) {
            this.progressSlideshow();
        }
    }

    public render() {
        const { children } = this.props;

        return <div className={`motion-elements-container`} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            {this.props.showNavigation == true && <div className="left-arrow" onClick={this.goInDirection.bind(this, 'previous')}>
                <div className="circular-wraper">
                    <i className="ms-Icon ms-Icon--ChevronLeft" title="Previous" aria-hidden="true"></i>
                </div>
            </div>}
            <div className={`motion-elements-wrapper`} style={{
                transition: `transform 1s ease`,
                transform: `${this.getTransformProperty()}`
            }}>
                {children.map((child, index) => <div className={`motion-elements-slot`}
                    key={index}
                    style={{ order: index }}
                >
                    {child}
                </div>)}
            </div>
            {this.props.showNavigation == true && <div className="right-arrow" onClick={this.goInDirection.bind(this, 'next')}>
                <div className="circular-wraper">
                    <i className="ms-Icon ms-Icon--ChevronRight" title="next" aria-hidden="true"></i>
                </div>
            </div>}
        </div>;
    }
}