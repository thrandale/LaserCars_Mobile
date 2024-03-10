package com.lasercars_mobile

import android.view.SurfaceView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class NativeBackground(private val mCallerContext: ReactApplicationContext) : SimpleViewManager<SurfaceView>() {

    companion object {
        const val REACT_CLASS = "NativeBackground"
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    override fun createViewInstance(context: ThemedReactContext): SurfaceView {
        return SkiaCanvas(context)
    }

    @ReactProp(name = "backgroundColor")
    fun setBackgroundColor(view: SurfaceView, color: String?) {
        color?.let {
            (view as SkiaCanvas).setBackgroundColor(it)
        }
    }

    @ReactProp(name = "maxLength")
    fun setMaxLength(view: SurfaceView, maxLength: Int?) {
        maxLength?.let {
            (view as SkiaCanvas).setMaxLength(it)
        }
    }

    @ReactProp(name = "minLength")
    fun setMinLength(view: SurfaceView, minLength: Int?) {
        minLength?.let {
            (view as SkiaCanvas).setMinLength(it)
        }
    }

    @ReactProp(name = "maxLasers")
    fun setMaxLasers(view: SurfaceView, maxLasers: Int?) {
        maxLasers?.let {
            (view as SkiaCanvas).setMaxLasers(it)
        }
    }

    @ReactProp(name = "minSpeed")
    fun setMinSpeed(view: SurfaceView, minSpeed: Int?) {
        minSpeed?.let {
            (view as SkiaCanvas).setMinSpeed(it)
        }
    }

    @ReactProp(name = "speedRange")
    fun setSpeedRange(view: SurfaceView, speedRange: Int?) {
        speedRange?.let {
            (view as SkiaCanvas).setSpeedRange(it)
        }
    }

    @ReactProp(name = "minThickness")
    fun setMinThickness(view: SurfaceView, minThickness: Int?) {
        minThickness?.let {
            (view as SkiaCanvas).setMinThickness(it)
        }
    }

    @ReactProp(name = "maxThickness")
    fun setMaxThickness(view: SurfaceView, maxThickness: Int?) {
        maxThickness?.let {
            (view as SkiaCanvas).setMaxThickness(it)
        }
    }

    @ReactProp(name = "laserColors")
    fun setLaserColors(view: SurfaceView, colors: ReadableArray?) {
        if (colors != null && colors.size() > 0) {
            (view as SkiaCanvas).setLaserColors(colors)
        }
    }

    @ReactProp(name = "running")
    fun setPaused(view: SurfaceView, running: Boolean) {
        (view as SkiaCanvas).setRunning(running)
    }
}