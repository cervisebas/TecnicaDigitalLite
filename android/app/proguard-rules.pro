# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-fs
-keep class com.rnfs.** { *; }
-dontwarn com.rnfs.**

# react-native-html-to-pdf
-keep class com.christopherdro.htmltopdf.** { *; }
-dontwarn com.christopherdro.htmltopdf.**

# react-native-safe-area-context
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# react-native-svg
-keep class com.horcrux.svg.** { *; }

# react-native-system-navigation-bar
-keep class com.reactnativesystemnavigationbar.** { *; }
-dontwarn com.reactnativesystemnavigationbar.**

# react-native-vector-icons
-keep class com.oblador.vectoricons.** { *; }
-dontwarn com.oblador.vectoricons.**

# react-native-view-shot
-keep class fr.greweb.reactnativeviewshot.** { *; }
-dontwarn fr.greweb.reactnativeviewshot.**

# react-native-share
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# react-native-splash-screen
-keep class org.devio.rn.splashscreen.** { *; }
-dontwarn org.devio.rn.splashscreen.**

# react-native-version-check
-keep class io.xogus.reactnative.versioncheck.** { *; }
-dontwarn io.xogus.reactnative.versioncheck.**

# react-native-linear-gradient
-keep class com.fyndx.LinearGradient.** { *; }
-dontwarn com.fyndx.LinearGradient.**

# @react-native-async-storage/async-storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**