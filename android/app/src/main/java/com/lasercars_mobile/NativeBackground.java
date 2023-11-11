package com.lasercars_mobile;

import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;


public class NativeBackground extends SimpleViewManager<View> {

    public static final String REACT_CLASS = "NativeBackground";
    ReactApplicationContext mCallerContext;

    public NativeBackground(ReactApplicationContext reactContext) {
        mCallerContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public View createViewInstance(ThemedReactContext context) {
        return new SkiaCanvas(context);
    }
}