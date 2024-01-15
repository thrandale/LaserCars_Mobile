package com.lasercars_mobile

import android.graphics.Canvas
import android.view.SurfaceHolder

class DrawingThread(private var surfaceHolder: SurfaceHolder, private var skiaCanvas: SkiaCanvas) : Thread() {
    private var isRunning = false
    private var previousTime: Long = System.currentTimeMillis()
    private val fps = 60

    fun setRunning(run: Boolean) {
        isRunning = run
    }

    override fun run() {
        var canvas: Canvas?

        while (isRunning) {
            var currentTimeMillis = System.currentTimeMillis()
            var elapsedTimeMs = currentTimeMillis - previousTime
            val sleepTimeMs = (1000f / fps - elapsedTimeMs).toLong()

            canvas = null
            try {
                canvas = surfaceHolder.lockCanvas()

                if (canvas == null) {
                    sleep(1)
                    continue
                } else if (sleepTimeMs > 0) {
                    sleep(sleepTimeMs)
                }

                synchronized(surfaceHolder) {
                    currentTimeMillis = System.currentTimeMillis()
                    elapsedTimeMs = currentTimeMillis - previousTime
                    val percentageOfFrame = elapsedTimeMs.toDouble() / (1000f / fps)
                    skiaCanvas.update(percentageOfFrame, canvas)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                if (canvas != null) {
                    surfaceHolder.unlockCanvasAndPost(canvas)
                    previousTime = System.currentTimeMillis()
                }
            }
        }
    }
}