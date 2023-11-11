package com.lasercars_mobile;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;

import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SkiaCanvas extends View {
    private int width = Resources.getSystem().getDisplayMetrics().widthPixels;
    private int height = Resources.getSystem().getDisplayMetrics().heightPixels;

    public SkiaCanvas(Context context) {
        super(context);
        init();
    }

    private static final int maxLasers = 10;
    private static final int maxLength = 300;
    private static final int minLength = 100;
    private final List<Laser> lasers = new ArrayList<>();
    private final Random random = new Random();

    private void init() {
        Log.d("Width", String.valueOf(getWidth()));
        Log.d("Height", String.valueOf(height));
        for (int i = 0; i < maxLasers; i++) {
            int length = random.nextInt(maxLength - minLength) + minLength;
            Point start = new Point(random.nextInt(width+ height) - length - height, random.nextInt(height + length * 2) - length);
            int speed = random.nextInt(5) + 5;

            lasers.add(new Laser(start, length, speed));
        }

        postInvalidate(); // Trigger redraw
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        for (Laser laser : lasers) {
            laser.draw(canvas);
        }
    }

    private class Laser {
        Point start;
        int length;
        int speed;
        Paint paint;

        Laser(Point start, int length, int speed) {
            this.start = start;
            this.length = length;
            this.speed = speed;

            paint = new Paint();
            paint.setColor(Color.rgb(random.nextInt(256), random.nextInt(256), random.nextInt(256)));
        }

        void draw(Canvas canvas) {
            canvas.drawLine((float) start.x, (float) start.y, (float) (start.x + length), (float) (start.y + length), paint);
        }

        void update() {
            start = new Point(start.x + speed, start.y + speed);

            if (start.x > width|| start.y > height) {
                length = random.nextInt(maxLength - minLength) + minLength;
                start = new Point(random.nextInt(width+ height) - length - height, -length);
                paint.setColor(Color.rgb(random.nextInt(256), random.nextInt(256), random.nextInt(256)));
                speed = random.nextInt(5) + 5;
            }
        }
    }
}
