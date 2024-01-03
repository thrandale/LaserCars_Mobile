package com.lasercars_mobile;

import android.util.Log;
import android.view.SurfaceView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class NativeBackground extends SimpleViewManager<SurfaceView> {

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
    public SurfaceView createViewInstance(ThemedReactContext context) {
        return new SkiaCanvas(context);
    }

    @ReactProp(name = "backgroundColor")
    public void setBackgroundColor(SurfaceView view, String color) {
        if (color == null) {
            return;
        }
        ((SkiaCanvas) view).SetBackgroundColor(color);
    }

    @ReactProp(name = "maxLength")
    public void setMaxLength(SurfaceView view, Integer maxLength) {
        if (maxLength == null) {
            return;
        }
        ((SkiaCanvas) view).SetMaxLength(maxLength);
    }

    @ReactProp(name = "minLength")
    public void setMinLength(SurfaceView view, Integer minLength) {
        if (minLength == null) {
            return;
        }
        ((SkiaCanvas) view).SetMinLength(minLength);
    }

    @ReactProp(name = "maxLasers")
    public void setMaxLasers(SurfaceView view, Integer maxLasers) {
        if (maxLasers != null) {
            ((SkiaCanvas) view).SetMaxLasers(maxLasers);
        }
    }

    @ReactProp(name = "minSpeed")
    public void setMinSpeed(SurfaceView view, Integer minSpeed) {
        if (minSpeed != null) {
            ((SkiaCanvas) view).SetMinSpeed(minSpeed);
        }
    }

    @ReactProp(name = "speedRange")
    public void setSpeedRange(SurfaceView view, Integer speedRange) {
        if (speedRange == null) {
            return;
        }
        ((SkiaCanvas) view).SetSpeedRange(speedRange);
    }

    @ReactProp(name = "minThickness")
    public void setMinThickness(SurfaceView view, Integer minThickness) {
        if (minThickness != null) {
            ((SkiaCanvas) view).SetMinThickness(minThickness);
        }
    }

    @ReactProp(name = "maxThickness")
    public void setMaxThickness(SurfaceView view, Integer maxThickness) {
        if (maxThickness != null) {
            ((SkiaCanvas) view).SetMaxThickness(maxThickness);
        }
    }

    @ReactProp(name = "laserColors")
    public void setLaserColors(SurfaceView view, ReadableArray colors) {
        if (colors.size() > 0) {
            ((SkiaCanvas) view).SetLaserColors(colors);
        }
    }

}