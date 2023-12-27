package com.lasercars_mobile;

import android.graphics.Canvas;
import android.util.Log;
import android.view.SurfaceHolder;

public class DrawingThread extends Thread {
    private SurfaceHolder surfaceHolder;
    private SkiaCanvas skiaCanvas;
    private boolean isRunning = false;
    private long previousTime;
    private final int fps = 60;

    public DrawingThread(SurfaceHolder surfaceHolder, SkiaCanvas skiaCanvas) {
        this.surfaceHolder = surfaceHolder;
        this.skiaCanvas = skiaCanvas;

        previousTime = System.currentTimeMillis();
    }

    public void setRunning(boolean run) {
        isRunning = run;
    }

    @Override
    public void run() {
        Canvas canvas;

        while (isRunning) {

            long currentTimeMillis = System.currentTimeMillis();
            long elapsedTimeMs = currentTimeMillis - previousTime;
            long sleepTimeMs = (long) (1000f / fps - elapsedTimeMs);

            canvas = null;
            try {

                canvas = surfaceHolder.lockCanvas();

                if (canvas == null) {
                    Thread.sleep(1);
                    continue;
                } else if (sleepTimeMs > 0) {
                    Thread.sleep(sleepTimeMs);
                }

                synchronized (surfaceHolder) {
                    currentTimeMillis = System.currentTimeMillis();
                    elapsedTimeMs = currentTimeMillis - previousTime;
                    double percentageOfFrame = (double) elapsedTimeMs / (1000f / fps);
                    skiaCanvas.update(percentageOfFrame, canvas);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (canvas != null) {
                    surfaceHolder.unlockCanvasAndPost(canvas);
                    previousTime = System.currentTimeMillis();
                }
            }
        }
    }
}
