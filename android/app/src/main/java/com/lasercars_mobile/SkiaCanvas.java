package com.lasercars_mobile;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.WindowMetrics;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SkiaCanvas extends SurfaceView implements SurfaceHolder.Callback {
    private int width;
    private int height;
    private int backgroundColor;
    private int minLength;
    private int maxLength;
    private int maxLasers;
    private int minSpeed;
    private int speedRange;
    private int minThickness;
    private int maxThickness;
    private int[] colors;

    public SkiaCanvas(Context context) {
        super(context);
        getHolder().addCallback(this);

        Activity activity = getActivity();
        if (activity != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            WindowMetrics windowMetrics = activity.getWindowManager().getCurrentWindowMetrics();
            // Use windowMetrics
            width = windowMetrics.getBounds().width();
            height = windowMetrics.getBounds().height();
        } else {
            width = Resources.getSystem().getDisplayMetrics().widthPixels;
            height = Resources.getSystem().getDisplayMetrics().heightPixels;
        }
    }

    private Activity getActivity() {
        Context context = getContext();
        while (context instanceof ContextWrapper) {
            if (context instanceof Activity) {
                return (Activity) context;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        return null;
    }

    private DrawingThread drawingThread;
    private final List<Laser> lasers = new ArrayList<>();
    private final Random random = new Random();

    @Override
    public void surfaceCreated(@NonNull SurfaceHolder surfaceHolder) {
        drawingThread = new DrawingThread(surfaceHolder, this);
        drawingThread.setRunning(true);
        drawingThread.start();
    }

    @Override
    public void surfaceChanged(@NonNull SurfaceHolder surfaceHolder, int i, int i1, int i2) {
        // Do nothing
    }

    @Override
    public void surfaceDestroyed(@NonNull SurfaceHolder surfaceHolder) {
        boolean retry = true;

        drawingThread.setRunning(false);

        while (retry) {
            try {
                drawingThread.join();
                retry = false;
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void update(double percentageOfFrame, @NonNull Canvas canvas) {
        canvas.drawColor(backgroundColor);
        for (Laser laser : lasers) {
            laser.update(percentageOfFrame);
            laser.draw(canvas);
        }
    }

    public void SetBackgroundColor(String color) {
        backgroundColor = Color.parseColor(color);
    }

    public void SetMinLength(int minLength) {
        this.minLength = minLength * 2;
        InitIfReady();
    }

    public void SetMaxLength(int maxLength) {
        this.maxLength = maxLength * 2;
        InitIfReady();
    }

    public void SetMaxLasers(int maxLasers) {
        this.maxLasers = maxLasers;
        InitIfReady();
    }

    public void SetLaserColors(@NonNull ReadableArray colors) {
        this.colors = new int[colors.size()];
        for (int i = 0; i < colors.size(); i++) {
            this.colors[i] = Color.parseColor(colors.getString(i));
        }
        InitIfReady();
    }

    public void SetMinSpeed(int minSpeed) {
        this.minSpeed = minSpeed * 2;
        InitIfReady();
    }

    public void SetSpeedRange(int speedRange) {
        this.speedRange = speedRange;
        InitIfReady();
    }

    public void SetMinThickness(int minThickness) {
        this.minThickness = minThickness * 3;
        InitIfReady();
    }

    public void SetMaxThickness(int maxThickness) {
        this.maxThickness = maxThickness * 3;
        InitIfReady();
    }

    private void InitIfReady() {
        if (colors == null || colors.length == 0 || maxLasers <= 0 || minSpeed <= 0 || speedRange <= 0 || minThickness <= 0 || maxThickness <= 0 || minLength <= 0 || maxLength <= 0) {
            return;
        }

        lasers.clear();
        for (int i = 0; i < maxLasers; i++) {
            int length = random.nextInt(maxLength - minLength) + minLength;
            Point start = new Point(random.nextInt(width + height) - length - height, random.nextInt(height + length * 2) - length);
            int speed = random.nextInt(speedRange) + minSpeed;

            lasers.add(new Laser(start, length, speed, colors[random.nextInt(colors.length)]));
        }
    }

    private class Laser {
        Point start;
        int length;
        int speed;
        Paint paint;

        Laser(Point start, int length, int speed, int color) {
            this.start = start;
            this.length = length;
            this.speed = speed;

            paint = new Paint();
            paint.setColor(color);
            paint.setStrokeWidth((float) InterpolateThickness());
        }

        void draw(@NonNull Canvas canvas) {
            canvas.drawLine((float) start.x, (float) start.y, (float) (start.x + length), (float) (start.y + length), paint);
        }

        void update(double percentageOfFrame) {
            start = new Point(start.x + (int) (speed * percentageOfFrame), start.y + (int) (speed * percentageOfFrame));

            if (start.x > width || start.y > height) {
                length = random.nextInt(maxLength - minLength) + minLength;
                start = new Point(random.nextInt(width + height) - length - height, -length);
                paint.setColor(colors[random.nextInt(colors.length)]);
                speed = random.nextInt(speedRange) + minSpeed;
                paint.setStrokeWidth((float) InterpolateThickness());
            }
        }

        public double InterpolateThickness() {
            return ((double) (speed - minSpeed) / (speedRange)) * (maxThickness - minThickness) + minThickness;
        }
    }
}
