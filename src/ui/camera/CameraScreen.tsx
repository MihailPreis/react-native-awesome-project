import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Slider,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from 'expo-sharing';

const flashModeOrder: Record<string, string> = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const wbOrder: Record<string, string> = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
};

const landmarkSize = 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 10, // TODO: чекнуть для андройда
        backgroundColor: '#000',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    autoFocusBox: {
        position: 'absolute',
        height: 64,
        width: 64,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
        opacity: 0.4,
    },
    flipText: {
        color: 'white',
        fontSize: 15,
    },
    zoomText: {
        position: 'absolute',
        bottom: 70,
        zIndex: 2,
        left: 2,
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
    },
    textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
});


export default function CameraScreen({ navigation, route }) {
    const [state, setState] = useState({
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        autoFocusPoint: {
            normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
            drawRectPosition: {
                x: Dimensions.get('window').width * 0.5 - 32,
                y: Dimensions.get('window').height * 0.5 - 32,
            },
        },
        depth: 0,
        type: 'back',
        whiteBalance: 'auto',
        ratio: '16:9',
        recordOptions: {
            mute: false,
            maxDuration: 5,
            quality: RNCamera.Constants.VideoQuality['288p'],
        },
        isRecording: false,
        canDetectFaces: false,
        canDetectText: false,
        canDetectBarcode: false,
        faces: [],
        textBlocks: [],
        barcodes: [],
    })

    let camera: any

    function toggleFacing() {
        setState(s => {
            return { ...s, type: s.type === 'back' ? 'front' : 'back' };
        });
    }

    function toggleFlash() {
        setState(s => {
            return { ...s, flash: flashModeOrder[state.flash] }
        });
    }

    function toggleWB() {
        setState(s => {
            return { ...s, whiteBalance: wbOrder[s.whiteBalance] }
        });
    }

    function toggleFocus() {
        setState(s => {
            return { ...s, autoFocus: s.autoFocus === 'on' ? 'off' : 'on' }
        });
    }

    function touchToFocus(event: any) {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const isPortrait = screenHeight > screenWidth;

        let x = pageX / screenWidth;
        let y = pageY / screenHeight;
        // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
        if (isPortrait) {
            x = pageY / screenHeight;
            y = -(pageX / screenWidth) + 1;
        }

        setState(s => {
            return {
                ...s, autoFocusPoint: {
                    normalized: { x, y },
                    drawRectPosition: { x: pageX, y: pageY },
                }
            }
        });
    }

    function zoomOut() {
        setState(s => {
            return { ...s, zoom: s.zoom - 0.1 < 0 ? 0 : s.zoom - 0.1 }
        });
    }

    function zoomIn() {
        setState(s => {
            return { ...s, zoom: s.zoom + 0.1 > 1 ? 1 : s.zoom + 0.1 }
        });
    }

    function setFocusDepth(depth: number) {
        setState(s => {
            return { ...s, depth: depth }
        });
    }

    async function takePicture() {
        if (camera) {
            const data = await camera.takePictureAsync();
            if (data.uri != undefined) {
                await shareUri(data.uri);
                console.log('takePicture', data);
            } else {
                console.warn('takePicture', data);
            }
        }
    };

    async function takeVideo() {
        const { isRecording } = state;
        if (camera && !isRecording) {
            try {
                const promise = camera.recordAsync(state.recordOptions);

                if (promise) {
                    setState(s => {
                        return { ...s, isRecording: true }
                    });
                    const data = await promise;
                    if (data.uri != undefined) {
                        await shareUri(data.uri);
                        console.log('takeVideo', data);
                    } else {
                        console.warn('takeVideo', data);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    async function shareUri(uri: string) {
        let isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) return;
        try {
            await Sharing.shareAsync(uri);
        } catch (err) {
            console.warn("Sharing error: ", err)
        }
    }

    const toggle = (value: any) => () => setState(s => { return { ...s, [value]: !s[value] } });

    const facesDetected = (faces: never[]) => setState(s => { return { ...s, faces: faces } });

    const renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
        <View
            key={faceID}
            style={[
                styles.face,
                {
                    ...bounds.size,
                    left: bounds.origin.x,
                    top: bounds.origin.y,
                    transform: [
                        { perspective: 600 },
                        { rotateZ: `${rollAngle.toFixed(0)}deg` },
                        { rotateY: `${yawAngle.toFixed(0)}deg` },
                    ]
                }
            ]}
        >
            <Text style={styles.faceText}>ID: {faceID}</Text>
            <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
            <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
        </View>
    );

    function renderLandmarksOfFace(face: any) {
        const renderLandmark = (position: any) =>
            position && (
                <View
                    style={[
                        styles.landmark,
                        {
                            left: position.x - landmarkSize / 2,
                            top: position.y - landmarkSize / 2,
                        },
                    ]}
                />
            );
        return (
            <View key={`landmarks-${face.faceID}`}>
                {renderLandmark(face.leftEyePosition)}
                {renderLandmark(face.rightEyePosition)}
                {renderLandmark(face.leftEarPosition)}
                {renderLandmark(face.rightEarPosition)}
                {renderLandmark(face.leftCheekPosition)}
                {renderLandmark(face.rightCheekPosition)}
                {renderLandmark(face.leftMouthPosition)}
                {renderLandmark(face.mouthPosition)}
                {renderLandmark(face.rightMouthPosition)}
                {renderLandmark(face.noseBasePosition)}
                {renderLandmark(face.bottomMouthPosition)}
            </View>
        );
    }

    const renderFaces = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {state.faces.map(renderFace)}
        </View>
    );

    const renderLandmarks = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {state.faces.map(renderLandmarksOfFace)}
        </View>
    );

    const renderTextBlocks = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {state.textBlocks.map(renderTextBlock)}
        </View>
    );

    const renderTextBlock = ({ bounds, value }) => (
        <React.Fragment key={value + bounds.origin.x}>
            <Text style={[styles.textBlock, { left: bounds.origin.x, top: bounds.origin.y }]}>
                {value}
            </Text>
            <View
                style={[
                    styles.text,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}
            />
        </React.Fragment>
    );

    const textRecognized = (object: any) => {
        const { textBlocks } = object;
        setState(s => { return { ...s, textBlocks: textBlocks } });
    };

    const barcodeRecognized = ({ barcodes: [any] }) => setState(s => { return { ...s, barcodes: barcodes } });

    const renderBarcodes = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {state.barcodes.map(renderBarcode)}
        </View>
    );

    const renderBarcode = ({ bounds, data, type }) => (
        <React.Fragment key={data + bounds.origin.x}>
            <View
                style={[
                    styles.text,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}
            >
                <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
            </View>
        </React.Fragment>
    );

    const renderRecording = () => {
        const { isRecording } = state;
        const backgroundColor = isRecording ? 'white' : 'darkred';
        const action = isRecording ? stopVideo : takeVideo;
        const button = isRecording ? renderStopRecBtn() : renderRecBtn();
        return (
            <TouchableOpacity
                style={[
                    styles.flipButton,
                    {
                        flex: 0.3,
                        alignSelf: 'flex-end',
                        backgroundColor,
                    },
                ]}
                onPress={() => action()}
            >
                {button}
            </TouchableOpacity>
        );
    };

    const stopVideo = async () => {
        await camera.stopRecording();
        setState(s => { return { ...s, isRecording: false } });
    };

    function renderRecBtn() {
        return <Text style={styles.flipText}> REC </Text>;
    }

    function renderStopRecBtn() {
        return <Text style={styles.flipText}> ☕ </Text>;
    }

    function renderCamera() {
        const { canDetectFaces, canDetectText, canDetectBarcode } = state;

        const drawFocusRingPosition = {
            top: state.autoFocusPoint.drawRectPosition.y - 32,
            left: state.autoFocusPoint.drawRectPosition.x - 32,
        };
        return (
            <RNCamera
                ref={ref => { camera = ref }}
                style={{
                    flex: 1,
                    justifyContent: 'space-between'
                }}
                type={state.type}
                flashMode={state.flash}
                autoFocus={state.autoFocus}
                autoFocusPointOfInterest={state.autoFocusPoint.normalized}
                zoom={state.zoom}
                whiteBalance={state.whiteBalance}
                ratio={state.ratio}
                focusDepth={state.depth}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                faceDetectionLandmarks={
                    RNCamera.Constants.FaceDetection.Landmarks
                        ? RNCamera.Constants.FaceDetection.Landmarks.all
                        : undefined
                }
                onFacesDetected={canDetectFaces ? facesDetected : null}
                onTextRecognized={canDetectText ? textRecognized : null}
                onGoogleVisionBarcodesDetected={canDetectBarcode ? barcodeRecognized : null}
            >
                <View style={StyleSheet.absoluteFill}>
                    <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
                    <TouchableWithoutFeedback onPress={touchToFocus}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
                </View>
                <SafeAreaView
                    style={{
                        flex: 0.5,
                        height: 72,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <TouchableOpacity style={styles.flipButton} onPress={toggleFacing}>
                            <Text style={styles.flipText}> FLIP </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleFlash}>
                            <Text style={styles.flipText}> FLASH: {state.flash} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleWB}>
                            <Text style={styles.flipText}> WB: {state.whiteBalance} </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <TouchableOpacity onPress={toggle('canDetectFaces')} style={styles.flipButton}>
                            <Text style={styles.flipText}>
                                {!canDetectFaces ? 'Detect Faces' : 'Detecting Faces'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggle('canDetectText')} style={styles.flipButton}>
                            <Text style={styles.flipText}>
                                {!canDetectText ? 'Detect Text' : 'Detecting Text'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggle('canDetectBarcode')} style={styles.flipButton}>
                            <Text style={styles.flipText}>
                                {!canDetectBarcode ? 'Detect Barcode' : 'Detecting Barcode'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <SafeAreaView style={{ marginHorizontal: 10 }}>
                    <View
                        style={{
                            height: 20,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                        }}
                    >
                        <Slider
                            style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
                            onValueChange={setFocusDepth}
                            step={0.1}
                            disabled={state.autoFocus === 'on'}
                        />
                    </View>
                    <View
                        style={{
                            height: 56,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                        }}
                    >
                        {renderRecording()}
                    </View>
                    {state.zoom !== 0 && (
                        <Text style={[styles.flipText, styles.zoomText]}>Zoom: {state.zoom}</Text>
                    )}
                    <View
                        style={{
                            height: 56,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                        }}
                    >
                        <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                            onPress={() => navigation.pop()}
                        >
                            <Text style={styles.flipText}> { '<' } </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                            onPress={zoomIn}
                        >
                            <Text style={styles.flipText}> + </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                            onPress={zoomOut}
                        >
                            <Text style={styles.flipText}> - </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                            onPress={toggleFocus}
                        >
                            <Text style={styles.flipText}> AF : {state.autoFocus} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
                            onPress={takePicture}
                        >
                            <Text style={styles.flipText}> SNAP </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                {!!canDetectFaces && renderFaces()}
                {!!canDetectFaces && renderLandmarks()}
                {!!canDetectText && renderTextBlocks()}
                {!!canDetectBarcode && renderBarcodes()}
            </RNCamera>
        );
    }

    return (
        <View style={styles.container}>{renderCamera()}</View>
    )
}