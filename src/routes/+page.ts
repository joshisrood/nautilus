import { error } from '@sveltejs/kit';
import { parse } from 'yaml';

export const load = async ({ fetch }) => {
    const specLocation = '/specs/protein-design.yaml';
    try {
        return fetch(specLocation)
            .then(response => response.text())
            .then(specText => { return { spec: parse(specText), text: specText }; });
    }
    catch(e: unknown) {
        return error(500, (e as Error).message);
    }
}