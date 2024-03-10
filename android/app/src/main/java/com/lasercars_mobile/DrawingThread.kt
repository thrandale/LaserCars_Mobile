package com.lasercars_mobile

import android.graphics.Canvas
import android.view.SurfaceHolder

class DrawingThread(private var surfaceHolder: SurfaceHolder, private var skiaCanvas: SkiaCanvas) :
    Thread() {
    private var isRunning = false
    private var previousTime: Long = System.currentTimeMillis()
    private val fps = 60

    fun setRunning(run: Boolean) {
        isRunning = run
    }

    override fun run() {
        var canvas: Canvas?
        var runOnce = false

        while (isRunning || !runOnce) {
            var elapsedTimeMs: Long
            val sleepTimeMs: Long

            canvas = null
            try {
                canvas = surfaceHolder.lockCanvas()

                if (canvas != null) {
                    synchronized(surfaceHolder) {
                        elapsedTimeMs = System.currentTimeMillis() - previousTime
                        val percentageOfFrame = elapsedTimeMs.toDouble() / (1000f / fps)
                        previousTime = System.currentTimeMillis()
                        skiaCanvas.update(percentageOfFrame, canvas)
                        runOnce = true
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                if (canvas != null) {
                    surfaceHolder.unlockCanvasAndPost(canvas)
                    elapsedTimeMs = System.currentTimeMillis() - previousTime
                    sleepTimeMs = (1000f / fps - elapsedTimeMs).toLong()

                    if (sleepTimeMs > 0) {
                        sleep(sleepTimeMs)
                    }
                } else {
                    sleep(1)
                }
            }
        }
    }
}