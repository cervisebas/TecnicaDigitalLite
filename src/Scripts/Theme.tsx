import Color from "color";
import { MD3LightTheme, MD3Theme } from "react-native-paper";
import rgbaToRgb from "rgba-to-rgb";
import tokens from "./tokens.json";

function filter(value: typeof tokens.entities[0]) {
    return value.category_id == 'sys.color.light';
}
function getValue(value: string) {
    function find(v: typeof tokens.entities[0]) { return v.id.indexOf(value) !== -1; }
    return ThemeLight.find(find)!.value;
}
const ThemeLight: typeof tokens.entities = tokens.entities.filter(filter);

// Global Colors
const primary = getValue("md.sys.color.primary.light");
const background = getValue("md.sys.color.background.light");
const surface = getValue("md.sys.color.surface.light");

const backgroundRGB = Color(background).rgb().string();
const primaryRGB = Color(primary).rgb();

export const Theme: MD3Theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary,
        primaryContainer: getValue("md.sys.color.primary-container.light"),
        secondary: getValue("md.sys.color.secondary.light"),
        secondaryContainer: getValue("md.sys.color.secondary-container.light"),
        tertiary: getValue("md.sys.color.tertiary.light"),
        tertiaryContainer: getValue("md.sys.color.tertiary-container.light"),
        surface,
        surfaceVariant: getValue("md.sys.color.surface-variant.light"),
        surfaceDisabled: Color(surface)
            .alpha(0.12)
            .rgb()
            .string(),
        background,
        error: getValue("md.sys.color.error.light"),
        errorContainer: getValue("md.sys.color.error-container.light"),
        onPrimary: getValue("md.sys.color.on-primary.light"),
        onPrimaryContainer: getValue("md.sys.color.on-primary-container.light"),
        onSecondary: getValue("md.sys.color.on-secondary.light"),
        onSecondaryContainer: getValue("md.sys.color.on-secondary-container.light"),
        onTertiary: getValue("md.sys.color.on-tertiary.light"),
        onTertiaryContainer: getValue("md.sys.color.on-tertiary-container.light"),
        onSurface: getValue("md.sys.color.on-surface.light"),
        onSurfaceVariant: getValue("md.sys.color.on-surface-variant.light"),
        onSurfaceDisabled: Color(surface)
            .alpha(0.38)
            .rgb()
            .string(),
        onError: getValue("md.sys.color.on-error.light"),
        onErrorContainer: getValue("md.sys.color.on-error-container.light"),
        onBackground: getValue("md.sys.color.on-background.light"),
        outline: getValue("md.sys.color.outline.light"),
        outlineVariant: getValue("md.sys.color.outline-variant.light"),
        inverseSurface: getValue("md.sys.color.inverse-surface.light"),
        inverseOnSurface: getValue("md.sys.color.inverse-on-surface.light"),
        inversePrimary: getValue("md.sys.color.inverse-primary.light"),
        shadow: getValue("md.sys.color.shadow.light"),
        scrim: getValue("md.sys.color.scrim.light"),
        elevation: {
            level0: 'transparent',
            // Note: Color values with transparency cause RN to transfer shadows to children nodes
            // instead of View component in Surface. Providing solid background fixes the issue.
            // Opaque color values generated with `palette.primary99` used as background
            level1: rgbaToRgb(backgroundRGB, primaryRGB.alpha(0.05).string()), // palette.primary40, alpha 0.05
            level2: rgbaToRgb(backgroundRGB, primaryRGB.alpha(0.08).string()), // palette.primary40, alpha 0.08
            level3: rgbaToRgb(backgroundRGB, primaryRGB.alpha(0.11).string()), // palette.primary40, alpha 0.11
            level4: rgbaToRgb(backgroundRGB, primaryRGB.alpha(0.12).string()), // palette.primary40, alpha 0.12
            level5: rgbaToRgb(backgroundRGB, primaryRGB.alpha(0.14).string()), // palette.primary40, alpha 0.14
        }
    }
};