#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(NativeBackgroundManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(minLength, int);
  RCT_EXPORT_VIEW_PROPERTY(maxLength, int);
  RCT_EXPORT_VIEW_PROPERTY(minSpeed, int);
  RCT_EXPORT_VIEW_PROPERTY(speedRange, int);
  RCT_EXPORT_VIEW_PROPERTY(laserColors, NSArray);
  RCT_EXPORT_VIEW_PROPERTY(minThickness, int);
  RCT_EXPORT_VIEW_PROPERTY(maxThickness, int);
  RCT_EXPORT_VIEW_PROPERTY(maxLasers, int);
  RCT_EXPORT_VIEW_PROPERTY(running, BOOL);
@end
