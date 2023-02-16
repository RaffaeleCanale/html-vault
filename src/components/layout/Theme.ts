import { minimizeCss } from '../../utils/EsbuildUtils';

const Palette = {
    colorPrimary: '#f9bc60',
    colorPrimaryRgb: '249; 188; 96',
    colorPrimaryContrast: '#000000',
    colorPrimaryContrastRgb: '0; 0; 0',
    colorPrimaryShade: '#dba554',
    colorPrimaryTint: '#fac370',

    colorSecondary: '#abd1c6',
    colorSecondaryRgb: '171; 209; 198',
    colorSecondaryContrast: '#000000',
    colorSecondaryContrastRgb: '0; 0; 0',
    colorSecondaryShade: '#96b8ae',
    colorSecondaryTint: '#b3d6cc',

    colorTertiary: '#0f3433',
    colorTertiaryRgb: '15; 52; 51',
    colorTertiaryContrast: '#ffffff',
    colorTertiaryContrastRgb: '255; 255; 255',
    colorTertiaryShade: '#0d2e2d',
    colorTertiaryTint: '#274847',

    colorError: '#e16162',
    colorErrorRgb: '225; 97; 98',
    colorErrorContrast: '#000000',
    colorErrorContrastRgb: '0; 0; 0',
    colorErrorShade: '#c65556',
    colorErrorTint: '#e47172',

    colorDark: '#222',
    colorDarkRgb: '0; 0; 0',
    colorDarkContrast: '#F2F2F2',
    // colorDarkContrastRgb: '255; 255; 255',
    colorDarkShade: '#000000',
    colorDarkTint: '#1a1a1a',
} as const;

// type Color = keyof typeof Palette;

interface Theme {
    '--background': string;
    '--background-color': string;

    '--container-color': string;
    '--container-color-border': string;

    '--font-color': string;
    '--font-color-disabled': string;

    '--link': string;
    '--link-hover': string;

    '--input-background-color': string;

    '--button-background-color': string;
    '--button-font-color': string;

    '--color-error': string;
}

const LightTheme: Theme = {
    '--background': Palette.colorSecondary,
    '--background-color': Palette.colorSecondary,

    '--container-color': Palette.colorSecondaryTint,
    '--container-color-border': Palette.colorSecondaryShade,

    '--font-color': Palette.colorDark,
    '--font-color-disabled': 'red',

    '--link': Palette.colorPrimaryShade,
    '--link-hover': Palette.colorPrimary,

    '--input-background-color': 'red',

    '--button-background-color': 'red',
    '--button-font-color': 'red',

    '--color-error': Palette.colorErrorShade,
};

const ThemeDark: Theme = {
    '--background': `linear-gradient(150deg, ${Palette.colorTertiary} 0%, ${Palette.colorTertiaryTint} 100%)`,
    '--background-color': Palette.colorTertiary,

    '--container-color': Palette.colorTertiaryTint,
    '--container-color-border': Palette.colorTertiaryShade,

    '--font-color': Palette.colorDarkContrast,
    '--font-color-disabled': Palette.colorTertiaryShade,

    '--link': Palette.colorPrimary,
    '--link-hover': Palette.colorPrimaryShade,

    '--input-background-color': Palette.colorTertiaryTint,

    '--button-background-color': Palette.colorPrimary,
    '--button-font-color': Palette.colorPrimaryContrast,

    '--color-error': Palette.colorErrorShade,
};

export function buildThemeCss(): string {
    function toCss(theme: Theme): string {
        return Object.entries(theme)
            .map(([key, value]) => `${key}: ${value as string};`)
            .join('\n');
    }

    const css = `
    :root {
        ${toCss(LightTheme)}
    }

    .--dark {
        ${toCss(ThemeDark)}
    }
    `;

    return minimizeCss(css);
}
