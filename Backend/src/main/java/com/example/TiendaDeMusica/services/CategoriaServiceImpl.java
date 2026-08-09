package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Categoria;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoriaServiceImpl extends BaseServiceImpl<Categoria,Long> implements CategoriaService {

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        super((BaseRepository<Categoria, Long>) categoriaRepository);
    }
}
