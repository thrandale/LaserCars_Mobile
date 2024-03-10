package com.lasercars_mobile

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.res.Resources
import android.graphics.*
import android.view.SurfaceHolder
import android.view.SurfaceView
import com.facebook.react.bridge.ReadableArray
import kotlin.random.Random

class SkiaCanvas(context: Context) : SurfaceView(context), SurfaceHolder.Callback {
    private var width: Int
    private var height: Int
    private var backgroundColor: Int = 0
    private var minLength: Int = 0
    private var maxLength: Int = 0
    private var maxLasers: Int = 0
    private var minSpeed: Int = 0
    private var speedRange: Int = 0
    private var minThickness: Int = 0
    private var maxThickness: Int = 0
    private var colors: IntArray? = null

    private var drawingThread: DrawingThread? = null
    private val lasers = ArrayList<Laser>()
    private val random = Random

    init {
        holder.addCallback(this)

        val activity = getActivity()
        if (activity != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            val windowMetrics = activity.windowManager.currentWindowMetrics
            width = windowMetrics.bounds.width()
            height = windowMetrics.bounds.height()
        } else {
            width = Resources.getSystem().displayMetrics.widthPixels
            height = Resources.getSystem().displayMetrics.heightPixels
        }
    }

    private fun getActivity(): Activity? {
        var context = context
        while (context is ContextWrapper) {
            if (context is Activity) {
                return context
            }
            context = context.baseContext
        }
        return null
    }

    override fun surfaceCreated(surfaceHolder: SurfaceHolder) {
        // Do nothing
    }

    override fun surfaceChanged(surfaceHolder: SurfaceHolder, i: Int, i1: Int, i2: Int) {
        // Do nothing
    }

    override fun surfaceDestroyed(surfaceHolder: SurfaceHolder) {
        var retry = true

        drawingThread?.setRunning(false)

        while (retry) {
            try {
                drawingThread?.join()
                retry = false
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }
    }

    fun update(percentageOfFrame: Double, canvas: Canvas) {
        canvas.drawColor(backgroundColor)
        for (laser in lasers) {
            laser.update(percentageOfFrame)
            laser.draw(canvas)
        }
    }

    fun setBackgroundColor(color: String) {
        backgroundColor = Color.parseColor(color)
    }

    fun setMinLength(minLength: Int) {
        this.minLength = minLength * 2
        initIfReady()
    }

    fun setMaxLength(maxLength: Int) {
        this.maxLength = maxLength * 2
        initIfReady()
    }

    fun setMaxLasers(maxLasers: Int) {
        this.maxLasers = maxLasers
        initIfReady()
    }

    fun setLaserColors(colors: ReadableArray) {
        this.colors = IntArray(colors.size())
        for (i in 0 until colors.size()) {
            this.colors!![i] = Color.parseColor(colors.getString(i))
        }
        initIfReady()
    }

    fun setMinSpeed(minSpeed: Int) {
        this.minSpeed = minSpeed * 2
        initIfReady()
    }

    fun setSpeedRange(speedRange: Int) {
        this.speedRange = speedRange
        initIfReady()
    }

    fun setMinThickness(minThickness: Int) {
        this.minThickness = minThickness * 3
        initIfReady()
    }

    fun setMaxThickness(maxThickness: Int) {
        this.maxThickness = maxThickness * 3
        initIfReady()
    }

    private fun initIfReady() {
        if (colors == null || colors!!.isEmpty() || maxLasers <= 0 || minSpeed <= 0 || speedRange <= 0 || minThickness <= 0 || maxThickness <= 0 || minLength <= 0 || maxLength <= 0) {
            return
        }

        lasers.clear()
        for (i in 0 until maxLasers) {
            val length = random.nextInt(maxLength - minLength) + minLength
            val start = Point(random.nextInt(width + height) - length - height, random.nextInt(height + length) - length)
            val speed = random.nextInt(speedRange) + minSpeed

            lasers.add(Laser(start, length, speed, colors!![random.nextInt(colors!!.size)]))
        }
    }

    fun setRunning(running: Boolean) {
        if (drawingThread == null) {
            drawingThread = DrawingThread(holder, this)
            drawingThread?.setRunning(running)
            drawingThread?.start()
        }
        if (!running && drawingThread != null) {
            drawingThread?.setRunning(false)
            drawingThread = null
        }
    }

    private inner class Laser(var start: Point, var length: Int, var speed: Int, color: Int) {
        var paint: Paint = Paint()

        init {
            paint.color = color
            paint.strokeWidth = interpolateThickness().toFloat()
        }

        fun draw(canvas: Canvas) {
            canvas.drawLine(start.x.toFloat(), start.y.toFloat(), (start.x + length).toFloat(), (start.y + length).toFloat(), paint)
        }

        fun update(percentageOfFrame: Double) {
            start = Point(start.x + (speed * percentageOfFrame).toInt(), start.y + (speed * percentageOfFrame).toInt())

            if (start.x > width || start.y > height) {
                length = random.nextInt(maxLength - minLength) + minLength
                start = Point(random.nextInt(width + height) - length - height, -length)
                paint.color = colors!![random.nextInt(colors!!.size)]
                speed = random.nextInt(speedRange) + minSpeed
                paint.strokeWidth = interpolateThickness().toFloat()
            }
        }

        private fun interpolateThickness(): Double {
            return ((speed - minSpeed).toDouble() / speedRange) * (maxThickness - minThickness) + minThickness
        }
    }
}