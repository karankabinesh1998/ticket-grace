import React, { Component } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });


export default class AudioRecorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false,
            isBlocked: false,
            buttonName:'Tap to speak',
        }
    }

    async componentDidMount() {
        navigator.getUserMedia({ audio: true },
            () => {
                // console.log('Permission Granted');
                this.setState({ isBlocked: false });
            },
            () => {
                // console.log('Permission Denied');
                this.setState({ isBlocked: true })
            },
        );
    }

    start = () => {
        if (this.state.isBlocked) {
            // console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    this.setState({ isRecording: true , buttonName : 'Tap to Stop ' });
                }).catch((e) => console.error(e));
        }
    };

    stop = () => {
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob);
                this.setState({ blobURL, isRecording: false , buttonName :'Tap to speak' });
                this.props.handleAudioFile(blob)
            }).catch((e) => console.log(e));
    };

    render() {
        const { buttonName } = this.state;
        return (
            <div className="row form-group">
                <div className="col-sm-3">
                    <button onClick={this.state.isRecording == false ? this.start : this.stop}
                     className={this.state.isRecording ==false ?'btn btn-success':'btn btn-danger'}
                     >
                    {buttonName}
                    </button>
                </div>
                <div className="col-sm-7">
                    <audio src={this.state.blobURL} controls="controls" />
                </div>
            </div>
        )
    }
}
