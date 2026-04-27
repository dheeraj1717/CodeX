import Docker from 'dockerode';

const pulledImages = new Set<string>();

export default async function pullImage(imageName: string): Promise<void> {
    if (pulledImages.has(imageName)) {
        console.log(`Image already pulled, skipping: ${imageName}`);
        return;
    }
    try {
        const docker = new Docker();
        return new Promise((resolve, reject) => {
            docker.pull(imageName, (err: Error | null, stream: NodeJS.ReadableStream) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                docker.modem.followProgress(stream, (err: Error | null, res: any) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    console.log(`Successfully pulled image: ${imageName}`);
                    pulledImages.add(imageName);
                    resolve();
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

export async function prewarmImages(images: string[]): Promise<void> {
    console.log('Pre-warming Docker images...');
    await Promise.all(images.map(pullImage));
    console.log('All images ready.');
}