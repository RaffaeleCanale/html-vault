import esbuild from 'esbuild';

export function minimizeCss(css: string): string {
    const result = esbuild.transformSync(css, {
        loader: 'css',
        minify: process.env.NODE_ENV !== 'development',
    });
    return result.code;
}

export async function buildScript(file: string): Promise<string> {
    const res = await esbuild.build({
        entryPoints: [`${process.cwd()}/src/${file}.ts`],
        bundle: true,
        write: false,
        minify: process.env.NODE_ENV !== 'development',
        format: 'esm',
        target: 'es2015',
        sourcemap: false,
        treeShaking: true,
        loader: {
            '.svg': 'text',
        },
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return res.outputFiles[0]!.text;
}
