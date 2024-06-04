package com.example.TrabajoPractico9.services;

import com.example.TrabajoPractico9.entities.Categoria;
import com.example.TrabajoPractico9.repositories.BaseRepository;
import com.example.TrabajoPractico9.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoriaServiceImpl extends BaseServiceImpl<Categoria,Long> implements CategoriaService {

    private CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        super((BaseRepository<Categoria, Long>) categoriaRepository);
        this.categoriaRepository = categoriaRepository;
    }
}